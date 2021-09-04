import {
    cassandraPostsByFeedGet,
    cassandraUserAuthentication,
    FCoreFeedGet,
    withHandleAsync
} from 'services'

const coreFeedGet: FCoreFeedGet = async (
    params,
    { cassandraClient, error, errorMessages, handleAsync, logger },
    { language, user }
) => {
    const [
        cassandraPostCreateError,
        cassandraPostCreateData
    ] = await cassandraPostsByFeedGet(
        {
            feedId: params.feedId,
            userId: user.id,
            cursor: params.cursor
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPostCreateError)
        throw error({
            name: cassandraPostCreateError.name,
            message: cassandraPostCreateError.message,
            logger
        })

    logger.info(cassandraPostCreateData)
    return cassandraPostCreateData
}

export default withHandleAsync(cassandraUserAuthentication(coreFeedGet))
