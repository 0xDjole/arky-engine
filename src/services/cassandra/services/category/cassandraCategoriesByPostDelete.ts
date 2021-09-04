import {
    FCassandraCategoriesByPostDelete,
    toPostId,
    withHandleAsync
} from 'services'

const cassandraCategoriesByPostDelete: FCassandraCategoriesByPostDelete = async (
    {
        post: {
            name,
            location: { latitude, longitude }
        },
        categories
    },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    if (!categories || !categories.length) return true

    const [
        cassandraCategoriesByPostDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM categories_by_post 
            WHERE post_id = ? 
            AND category_id IN ?;`,
        [
            toPostId({
                name,
                location: { latitude, longitude }
            }),
            categories.map(categoryItem => categoryItem.id)
        ],
        {
            prepare: true
        }
    )

    const [
        cassandraPostCategoryMinuteLookUpGetError,
        cassandraPostCategoryMinuteLookUpGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM post_category_lookup
            WHERE category_id IN ? 
            AND post_id = ?;`,
        [
            categories.map(categoryItem => categoryItem.id),
            toPostId({
                name,
                location: { latitude, longitude }
            })
        ],
        {
            prepare: true
        }
    )

    if (cassandraPostCategoryMinuteLookUpGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_CATEGORIES
        })

    const [
        cassandraPostByCategoriesDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM posts_by_category
            WHERE category_id IN ? 
            AND minute_id IN ?
            AND post_id = ?;`,
        [
            categories.map(categoryItem => categoryItem.id),
            cassandraPostCategoryMinuteLookUpGetData.rows.map(
                data => data.minute_id
            ),
            toPostId({
                name,
                location: { latitude, longitude }
            })
        ],
        {
            prepare: true
        }
    )

    const [
        cassandraPostByCategoriesMinutesDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM post_minutes_by_category
            WHERE category_id IN ? 
            AND minute_id IN ?;`,
        [
            categories.map(categoryItem => categoryItem.id),
            cassandraPostCategoryMinuteLookUpGetData.rows.map(
                data => data.minute_id
            )
        ],
        {
            prepare: true
        }
    )

    const [
        cassandraPostByCategoriesMinutesLookupDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM post_category_lookup
            WHERE category_id IN ? 
            AND post_id = ?;`,
        [
            categories.map(categoryItem => categoryItem.id),
            toPostId({
                name,
                location: { latitude, longitude }
            })
        ],
        {
            prepare: true
        }
    )

    if (
        cassandraCategoriesByPostDeleteError ||
        cassandraPostByCategoriesDeleteError ||
        cassandraPostByCategoriesMinutesDeleteError ||
        cassandraPostByCategoriesMinutesLookupDeleteError
    )
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_CATEGORIES
        })

    return true
}

export default withHandleAsync(cassandraCategoriesByPostDelete)
