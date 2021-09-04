import {
    categoryFromItem,
    FCassandraCategoriesByPostGet,
    postFromItem,
    withHandleAsync
} from 'services'

const cassandraCategoriesByPostGet: FCassandraCategoriesByPostGet = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraPostCategoriesGetError,
        cassandraPostCategoriesGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM categories_by_post WHERE post_id = ?;`,
        [id],
        {
            prepare: true
        }
    )

    if (
        cassandraPostCategoriesGetError ||
        !cassandraPostCategoriesGetData.rows ||
        !cassandraPostCategoriesGetData.rows.length
    )
        throw error({
            message: errorMessages[language].POST_DOES_NOT_EXIST
        })

    return {
        ...postFromItem(cassandraPostCategoriesGetData.rows[0]),
        categories: cassandraPostCategoriesGetData.rows.map(row =>
            categoryFromItem(row)
        )
    }
}

export default withHandleAsync(cassandraCategoriesByPostGet)
