import {
    cassandraCategoryCreate,
    cassandraPermissionsByUserCreate,
    cassandraUserAuthorization,
    categoryToDoc,
    EKafkaAction,
    EKafkaTopic,
    FCoreCategoryCreate,
    kafkaMessageProduce,
    userToDoc,
    withHandleAsync
} from 'services'

const coreCategoryCreate: FCoreCategoryCreate = async (
    params,
    {
        cassandraClient,
        error,
        errorMessages,
        handleAsync,
        logger,
        kafkaProducer
    },
    { language, user }
) => {
    const [
        cassandraCategoryCreateError,
        cassandraCategoryCreateData
    ] = await cassandraCategoryCreate(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        { language, user }
    )

    if (cassandraCategoryCreateError)
        throw error({
            name: cassandraCategoryCreateError.name,
            message: cassandraCategoryCreateError.message,
            logger
        })

    const [
        cassandraPermissionsByUserCreateError,
        cassandraPermissionsByUserCreateData
    ] = await cassandraPermissionsByUserCreate(
        {
            user,
            permissions: cassandraCategoryCreateData.permissions
        },
        { cassandraClient, errorMessages, handleAsync, error },
        { language, user }
    )

    if (cassandraPermissionsByUserCreateError)
        throw error({
            name: cassandraPermissionsByUserCreateError.name,
            message: cassandraPermissionsByUserCreateError.message,
            logger
        })

    if (kafkaProducer) {
        const [kafkaProducerError] = await kafkaMessageProduce(
            kafkaProducer,
            {
                id: cassandraCategoryCreateData.id,
                category: categoryToDoc(cassandraCategoryCreateData),
                user: userToDoc(cassandraPermissionsByUserCreateData, {
                    permissions:
                        cassandraPermissionsByUserCreateData.permissions
                })
            },
            EKafkaTopic.CATEGORIES,
            EKafkaAction.CREATE
        )

        if (kafkaProducerError)
            throw error({
                name: kafkaProducerError.name,
                message: kafkaProducerError.message,
                logger
            })
    }

    logger.info(cassandraCategoryCreateData)
    return cassandraCategoryCreateData
}

const validator = async () => ({
    categoryIds: ['CATEGROY#category'],
    action: 'CREATE',
    feature: 'CATEGORY',
    matchAllPermissions: true
})

export default withHandleAsync(
    cassandraUserAuthorization(coreCategoryCreate, validator)
)
