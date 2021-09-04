import {
    cassandraCategoriesByPostGet,
    cassandraUserAuthorization,
    FCorePostGet,
    ICorePostKey,
    IServiceContext,
    IServiceContextReused,
    withHandleAsync
} from 'services'

const corePostGet: FCorePostGet = async (
    { id },
    { cassandraClient, error, errorMessages, handleAsync, logger },
    { language }
) => {
    const [
        cassandraPostGetError,
        cassandraPostGetData
    ] = await cassandraCategoriesByPostGet(
        {
            id
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPostGetError) throw error(cassandraPostGetError)

    logger.info(cassandraPostGetData)
    return cassandraPostGetData
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
        action: 'GET',
        feature: 'POST',
        matchAllPermissions: false
    }
}

export default withHandleAsync(
    cassandraUserAuthorization(corePostGet, validator)
)
