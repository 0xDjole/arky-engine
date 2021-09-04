import {
    cassandraCategoryGet,
    cassandraUserAuthorization,
    FCoreCategoryGet,
    ICoreCategoryKey,
    withHandleAsync
} from 'services'

const coreCategoryGet: FCoreCategoryGet = async (
    params,
    { cassandraClient, error, errorMessages, handleAsync, logger },
    context
) => {
    const [
        cassandraCategoryGetError,
        cassandraCategoryGetData
    ] = await cassandraCategoryGet(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (cassandraCategoryGetError)
        throw error({
            name: cassandraCategoryGetError.name,
            message: cassandraCategoryGetError.message,
            logger
        })

    logger.info(cassandraCategoryGetData)
    return cassandraCategoryGetData
}

const validator = async (params: ICoreCategoryKey) => ({
    categoryIds: [params.id],
    action: 'CREATE',
    feature: 'CATEGORY',
    matchAllPermissions: true
})

export default withHandleAsync(
    cassandraUserAuthorization(coreCategoryGet, validator)
)
