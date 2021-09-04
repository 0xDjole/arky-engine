import {
    categoryFromItem,
    FCassandraCategoriesGet,
    withHandleAsync
} from 'services'

const cassandraCategoriesGet: FCassandraCategoriesGet = async (
    params,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    if (!params || !params.length) return []

    const permissionIds = params.map(
        categoryKey => `PERMISSION#${categoryKey.id.split('#')[1]}#post#read`
    )

    const [
        cassandraCategoryGetError,
        cassandraCategoryGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permissions_by_category WHERE category_id IN ? AND category_permission_id IN ?`,
        [params.map(categoryKey => categoryKey.id), permissionIds],
        {
            prepare: true
        }
    )

    if (
        cassandraCategoryGetError ||
        !cassandraCategoryGetData ||
        !cassandraCategoryGetData.rows ||
        cassandraCategoryGetData.rows.length < params.length
    )
        throw error({
            message: errorMessages[language].CATEGORY_DOES_NOT_EXIST
        })

    return cassandraCategoryGetData.rows.map(row => categoryFromItem(row))
}

export default withHandleAsync(cassandraCategoriesGet)
