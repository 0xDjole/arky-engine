import {
    cassandraCategoriesByPostGet,
    cassandraPostDelete,
    cassandraUserAuthorization,
    EKafkaAction,
    EKafkaTopic,
    FCorePostDelete,
    ICorePostKey,
    IServiceContext,
    IServiceContextReused,
    kafkaMessageProduce,
    postToDoc,
    withHandleAsync
} from 'services'

const corePostDelete: FCorePostDelete = async (
    params,
    {
        cassandraClient,
        error,
        errorMessages,
        handleAsync,
        logger,
        kafkaProducer
    },
    context
) => {
    const [
        cassandraPostDeleteError,
        cassandraPostDeleteData
    ] = await cassandraPostDelete(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (cassandraPostDeleteError) throw error(cassandraPostDeleteError)

    if (kafkaProducer) {
        const [kafkaProducerError] = await kafkaMessageProduce(
            kafkaProducer,
            postToDoc(cassandraPostDeleteData),
            EKafkaTopic.POSTS,
            EKafkaAction.DELETE
        )

        if (kafkaProducerError)
            throw error({
                name: kafkaProducerError.name,
                message: kafkaProducerError.message,
                logger
            })
    }

    logger.info(cassandraPostDeleteData)
    return cassandraPostDeleteData
}

const validator = async (
    params: ICorePostKey,
    {
        cassandraClient,
        error,
        errorMessages,
        handleAsync
    }: IServiceContextReused,
    { language, user, headers }: IServiceContext
) => {
    const [
        cassandraCategoriesByPostError,
        cassandraCategoriesByPostData
    ] = await cassandraCategoriesByPostGet(
        {
            id: params.id
        },
        {
            cassandraClient,
            error,
            errorMessages,
            handleAsync
        },
        { language, user, headers }
    )

    if (cassandraCategoriesByPostError)
        throw error(cassandraCategoriesByPostError)

    return {
        categoryIds: cassandraCategoriesByPostData.categories.map(
            categoryItem => categoryItem.id
        ),
        action: 'DELETE',
        feature: 'POST',
        matchAllPermissions: true
    }
}

export default withHandleAsync(
    cassandraUserAuthorization(corePostDelete, validator)
)
