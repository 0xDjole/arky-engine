import {
    cassandraCategoryGet,
    FCassandraCategoryUpdate,
    withHandleAsync
} from 'services'

const cassandraCategoryUpdate: FCassandraCategoryUpdate = async (
    params,
    { cassandraClient, error, errorMessages, handleAsync },
    { language }
) => {
    const [
        cassandraCategoryGetError,
        cassandraCategoryGetData
    ] = await cassandraCategoryGet(
        {
            id: params.categoryId
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraCategoryGetError) throw error(cassandraCategoryGetError)

    return cassandraCategoryGetData
}

export default withHandleAsync(cassandraCategoryUpdate)
