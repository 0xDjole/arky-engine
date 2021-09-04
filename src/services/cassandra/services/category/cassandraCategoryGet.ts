import {
    categoryFromItem,
    FCassandraCategoryGet,
    withHandleAsync
} from 'services'

const cassandraCategoryGet: FCassandraCategoryGet = async (
    params,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraCategoryGetError,
        cassandraCategoryGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permissions_by_category WHERE category_id = ? LIMIT 1`,
        [params.id],
        {
            prepare: true
        }
    )

    if (
        cassandraCategoryGetError ||
        !cassandraCategoryGetData.rows ||
        !cassandraCategoryGetData.rows.length
    )
        throw error({
            message: errorMessages[language].CATEGORY_DOES_NOT_EXIST
        })

    const categoryData = categoryFromItem(cassandraCategoryGetData.rows[0])

    return categoryData
}

export default withHandleAsync(cassandraCategoryGet)
