import {
    cassandraUsersByPermissionGet,
    FassandraFeedsByCategoryDelete,
    withHandleAsync
} from 'services'

const cassandraFeedsByCategoryDelete: FassandraFeedsByCategoryDelete = async (
    params,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const permissionId = `PERMISSION#post#${params.id}#read`

    const [
        cassandraUsersByPermissionGetError,
        cassandraUsersByPermissionGetData
    ] = await cassandraUsersByPermissionGet(
        { id: permissionId },
        { cassandraClient, error, errorMessages },
        { language }
    )

    if (cassandraUsersByPermissionGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY_FEED
        })

    const [
        cassandraFeedsByCategoryAndUserError,
        cassandraFeedsByCategoryAndUserData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM feeds_by_category_and_user
            WHERE category_id = ? AND user_id IN ?;`,
        [
            params.id,
            cassandraUsersByPermissionGetData.map(userItem => userItem.id)
        ],
        {
            prepare: true
        }
    )

    if (cassandraFeedsByCategoryAndUserError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY_FEED
        })

    const [
        cassandraPostDaysByFeedError,
        cassandraPostDaysByFeedData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM post_days_by_feed 
            WHERE feed_id IN ?
            AND user_id IN ?;`,
        [
            cassandraFeedsByCategoryAndUserData.rows.map(row => row.feed_id),
            cassandraUsersByPermissionGetData.map(userItem => userItem.id)
        ],
        {
            prepare: true
        }
    )

    if (cassandraPostDaysByFeedError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY_FEED
        })

    const [
        cassandraFeedsByCategoryAndUserDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM feeds_by_category_and_user 
            WHERE user_id IN ?
            AND category_id = ?;`,
        [
            cassandraUsersByPermissionGetData.map(userItem => userItem.id),
            params.id
        ],
        {
            prepare: true
        }
    )

    if (cassandraFeedsByCategoryAndUserDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY_FEED
        })

    const [
        cassandraCategoriesByFeedError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM categories_by_feed 
            WHERE feed_id IN ?;`,
        [cassandraFeedsByCategoryAndUserData.rows.map(row => row.feed_id)],
        {
            prepare: true
        }
    )

    if (cassandraCategoriesByFeedError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY_FEED
        })

    const [
        cassandraPostDaysByFeedDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM posts_days_by_feed 
            WHERE feed_id IN ? AND user_id IN ?;`,
        [
            cassandraFeedsByCategoryAndUserData.rows.map(row => row.feed_id),
            cassandraUsersByPermissionGetData.map(userItem => userItem.id)
        ],
        {
            prepare: true
        }
    )

    if (cassandraPostDaysByFeedDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY_FEED
        })

    const [
        cassandraPostsByFeedDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM posts_by_feed 
            WHERE feed_id IN ? AND day IN ?;`,
        [
            cassandraFeedsByCategoryAndUserData.rows.map(row => row.feed_id),
            cassandraPostDaysByFeedData.rows.map(row => row.day)
        ],
        {
            prepare: true
        }
    )

    if (cassandraPostsByFeedDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY_FEED
        })

    return params
}

export default withHandleAsync(cassandraFeedsByCategoryDelete)
