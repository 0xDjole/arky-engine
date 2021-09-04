import {
    cassandraCategoryDelete,
    cassandraUserAuthorization,
    categoryToDoc,
    EKafkaAction,
    EKafkaTopic,
    FCoreCategoryDelete,
    ICoreCategoryKey,
    kafkaMessageProduce,
    withHandleAsync
} from 'services'

const coreCategoryDelete: FCoreCategoryDelete = async (
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
        cassandraCategoryDeleteError,
        cassandraCategoryDeleteData
    ] = await cassandraCategoryDelete(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (cassandraCategoryDeleteError)
        throw error({
            name: cassandraCategoryDeleteError.name,
            message: cassandraCategoryDeleteError.message,
            logger
        })

    if (kafkaProducer) {
        const [kafkaProducerError] = await kafkaMessageProduce(
            kafkaProducer,
            categoryToDoc(cassandraCategoryDeleteData),
            EKafkaTopic.CATEGORIES,
            EKafkaAction.DELETE
        )

        if (kafkaProducerError)
            throw error({
                name: kafkaProducerError.name,
                message: kafkaProducerError.message,
                logger
            })
    }

    logger.info(cassandraCategoryDeleteData)
    return cassandraCategoryDeleteData
}

const validator = async (params: ICoreCategoryKey) => ({
    categoryIds: [params.id],
    action: 'DELETE',
    feature: 'CATEGORY',
    matchAllPermissions: true
})

export default withHandleAsync(
    cassandraUserAuthorization(coreCategoryDelete, validator)
)
