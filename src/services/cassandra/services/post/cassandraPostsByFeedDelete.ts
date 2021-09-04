import { FCassandraPostsByFeedDelete, withHandleAsync } from 'services'

const cassandraPostsByFeedDelete: FCassandraPostsByFeedDelete = async (
    { post },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraFeedDaysByPostError,
        cassandraFeedDaysByPostData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM feed_days_by_post
            WHERE post_id = ?;`,
        [post.id],
        {
            prepare: true
        }
    )

    if (cassandraFeedDaysByPostError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_FEED
        })

    const [
        cassandraFeedsByPostError,
        cassandraFeedsByPostData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM feeds_by_post
            WHERE post_id = ? AND day IN ?;`,
        [post.id, cassandraFeedDaysByPostData.rows.map(row => row.day)],
        {
            prepare: true
        }
    )

    if (cassandraFeedsByPostError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_FEED
        })

    const [
        cassandraPostsByFeedDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM posts_by_feed
            WHERE feed_id IN ? 
            AND day IN ? 
            AND post_created_at = ? 
            AND post_category_id IN ? 
            AND post_id = ?;`,
        [
            cassandraFeedsByPostData.rows.map(row => row.feed_id),
            cassandraFeedDaysByPostData.rows.map(row => row.day),
            post.createdAt,
            post.categories.map(categoryItem => categoryItem.id),
            post.id
        ],
        {
            prepare: true
        }
    )

    if (cassandraPostsByFeedDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_FEED
        })

    const [
        cassandraFeedDaysByPostDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM feed_days_by_post
            WHERE post_id = ?;`,
        [post.id],
        {
            prepare: true
        }
    )

    if (cassandraFeedDaysByPostDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_FEED
        })

    const [
        cassandraFeedsByPostDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM feeds_by_post
            WHERE post_id = ? AND day IN ?;`,
        [post.id, cassandraFeedDaysByPostData.rows.map(row => row.day)],
        {
            prepare: true
        }
    )

    if (cassandraFeedsByPostDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_FEED
        })

    return true
}

export default withHandleAsync(cassandraPostsByFeedDelete)
