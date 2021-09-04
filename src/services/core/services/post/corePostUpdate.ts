import {
    cassandraPostUpdate,
    categoryToDoc,
    EKafkaAction,
    EKafkaTopic,
    FCorePostUpdate,
    kafkaMessageProduce,
    postToDoc,
    withHandleAsync
} from 'services'

const corePostUpdate: FCorePostUpdate = async (
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
        updatePostError,
        cassandraPostUpdateData
    ] = await cassandraPostUpdate(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (updatePostError)
        throw error({
            name: updatePostError.name,
            message: updatePostError.message,
            logger
        })

    if (kafkaProducer) {
        const [kafkaProducerError] = await kafkaMessageProduce(
            kafkaProducer,
            postToDoc(cassandraPostUpdateData, {
                categories: cassandraPostUpdateData.categories.map(
                    categoryItem => categoryToDoc(categoryItem)
                )
            }),
            EKafkaTopic.CATEGORIES,
            EKafkaAction.UPDATE
        )

        if (kafkaProducerError)
            throw error({
                name: kafkaProducerError.name,
                message: kafkaProducerError.message,
                logger
            })
    }

    logger.info(cassandraPostUpdateData)
    return cassandraPostUpdateData
}

export default withHandleAsync(corePostUpdate)
