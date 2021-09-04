import moment from 'moment'
import {
    cassandraPostCreate,
    cassandraPostsByFeedCreate,
    cassandraUserAuthorization,
    categoryToDoc,
    EKafkaAction,
    EKafkaTopic,
    elasticSearchUsersGet,
    FCorePostCreate,
    ICorePostInput,
    kafkaMessageProduce,
    postToDoc,
    toPermissionId,
    withHandleAsync
} from 'services'

const corePostCreate: FCorePostCreate = async (
    params,
    {
        cassandraClient,
        elasticSearchClient,
        error,
        errorMessages,
        handleAsync,
        logger,
        kafkaProducer
    },
    context
) => {
    const day = moment().add(1, 'day').startOf('day').toISOString()

    const [
        cassandraPostCreateError,
        cassandraPostCreateData
    ] = await cassandraPostCreate(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (cassandraPostCreateError)
        throw error({
            name: cassandraPostCreateError.name,
            message: cassandraPostCreateError.message,
            logger
        })

    const [
        elasticSearchUsersGetError,
        elasticSearchUsersGetData
    ] = await elasticSearchUsersGet(
        {
            permissionIds: cassandraPostCreateData.categories.map(
                categoryItem =>
                    toPermissionId({
                        categoryName: categoryItem.name,
                        feature: 'POST',
                        action: 'READ'
                    })
            ),
            matchAll: true
        },
        { elasticSearchClient, error, errorMessages, handleAsync },

        context
    )

    if (elasticSearchUsersGetError) throw error(elasticSearchUsersGetError)

    await Promise.all(
        elasticSearchUsersGetData.map(async userItem => {
            const [
                cassandraPostsByFeedCreateError
            ] = await cassandraPostsByFeedCreate(
                {
                    post: cassandraPostCreateData,
                    feedId: 'default',
                    userId: userItem.id,
                    day
                },
                {
                    cassandraClient,
                    error,
                    errorMessages,
                    handleAsync
                },
                context
            )

            if (cassandraPostsByFeedCreateError)
                throw error(cassandraPostsByFeedCreateError)
        })
    )

    if (kafkaProducer) {
        const [kafkaProducerError] = await kafkaMessageProduce(
            kafkaProducer,
            postToDoc(cassandraPostCreateData, {
                categories: cassandraPostCreateData.categories.map(
                    categoryItem => categoryToDoc(categoryItem)
                )
            }),
            EKafkaTopic.POSTS,
            EKafkaAction.CREATE
        )

        if (kafkaProducerError)
            throw error({
                name: kafkaProducerError.name,
                message: kafkaProducerError.message,
                logger
            })
    }

    logger.info(cassandraPostCreateData)
    return cassandraPostCreateData
}

const validator = async (params: ICorePostInput) => ({
    categoryIds: params.categoryIds,
    action: 'CREATE',
    feature: 'POST',
    matchAllPermissions: true
})

export default withHandleAsync(
    cassandraUserAuthorization(corePostCreate, validator)
)
