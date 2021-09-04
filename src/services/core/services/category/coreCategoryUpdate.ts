import {
    cassandraCategoryUpdate,
    cassandraUserAuthorization,
    categoryToDoc,
    EKafkaAction,
    EKafkaTopic,
    FCoreCategoryUpdate,
    ICoreCategoryUpdateInput,
    kafkaMessageProduce,
    withHandleAsync
} from 'services'

const coreCategoryUpdate: FCoreCategoryUpdate = async (
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
        cassandraCategoryError,
        cassandraCategoryUpdateData
    ] = await cassandraCategoryUpdate(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (cassandraCategoryError)
        throw error({
            name: cassandraCategoryError.name,
            message: cassandraCategoryError.message,
            logger
        })

    if (kafkaProducer) {
        const [kafkaProducerError] = await kafkaMessageProduce(
            kafkaProducer,
            categoryToDoc(cassandraCategoryUpdateData),
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

    logger.info(cassandraCategoryUpdateData)
    return cassandraCategoryUpdateData
}

const validator = async (params: ICoreCategoryUpdateInput) => ({
    categoryIds: [params.categoryId],
    action: 'UPDATE',
    feature: 'CATEGORY',
    matchAllPermissions: true
})

export default withHandleAsync(
    cassandraUserAuthorization(coreCategoryUpdate, validator)
)
