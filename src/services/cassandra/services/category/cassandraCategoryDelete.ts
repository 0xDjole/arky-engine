import {
    cassandraPermissionsByCategoryDelete,
    cassandraPermissionsByCategoryGet,
    cassandraPostsByCategoryDelete,
    cassandraPostsByCategoryGet,
    cassandraUsersByPermissionDelete,
    FCassandraCategoryDelete,
    withHandleAsync
} from 'services'

const cassandraCategoryDelete: FCassandraCategoryDelete = async (
    { id },
    { cassandraClient, error, errorMessages, handleAsync },
    { language }
) => {
    const [
        cassandraPermissionsByCategoryGetError,
        cassandraPermissionsByCategoryGetData
    ] = await cassandraPermissionsByCategoryGet(
        {
            id
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPermissionsByCategoryGetError)
        throw error(cassandraPermissionsByCategoryGetError)

    const [
        cassandraPostsByCategoryGetError,
        cassandraPostsByCategoryGetData
    ] = await cassandraPostsByCategoryGet(
        cassandraPermissionsByCategoryGetData,
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPostsByCategoryGetError)
        throw error(cassandraPostsByCategoryGetError)

    const [
        cassandraPostsByCategoryDeleteError
    ] = await cassandraPostsByCategoryDelete(
        {
            posts: cassandraPostsByCategoryGetData.posts,
            category: cassandraPermissionsByCategoryGetData
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPostsByCategoryDeleteError)
        throw error(cassandraPostsByCategoryDeleteError)

    const [
        cassandraPermissionsByCategoryDeleteError
    ] = await cassandraPermissionsByCategoryDelete(
        cassandraPermissionsByCategoryGetData,
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPermissionsByCategoryDeleteError)
        throw error(cassandraPermissionsByCategoryDeleteError)

    await Promise.all(
        cassandraPermissionsByCategoryGetData.permissions.map(
            async permissionItem => {
                await cassandraUsersByPermissionDelete(
                    permissionItem,
                    { cassandraClient, error, errorMessages, handleAsync },
                    { language }
                )
            }
        )
    )

    return cassandraPermissionsByCategoryGetData
}

export default withHandleAsync(cassandraCategoryDelete)
