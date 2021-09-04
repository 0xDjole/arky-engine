import {
    cassandraCategoryGet,
    cassandraCategoryModel,
    cassandraPermissionsByCategoryCreate,
    FCassandraCategoryCreate,
    toCategoryId,
    withHandleAsync
} from 'services'

const cassandraCategoryCreate: FCassandraCategoryCreate = async (
    params,
    { cassandraClient, errorMessages, handleAsync, error },
    { language }
) => {
    const category = cassandraCategoryModel(params)

    const [, cassandraCategoryGetData] = await cassandraCategoryGet(
        {
            id: toCategoryId(params)
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraCategoryGetData)
        throw error({
            message: errorMessages[language].CATEGORY_ALREADY_EXISTS
        })

    const [
        cassandraPermissionsByCategoryCreateError,
        cassandraPermissionsByCategoryCreateData
    ] = await cassandraPermissionsByCategoryCreate(
        category,
        { cassandraClient, errorMessages, handleAsync, error },
        { language }
    )

    if (cassandraPermissionsByCategoryCreateError)
        throw error({
            message: errorMessages[language].FAILED_TO_CREATE_CATEGORY
        })

    return cassandraPermissionsByCategoryCreateData
}

export default withHandleAsync(cassandraCategoryCreate)
