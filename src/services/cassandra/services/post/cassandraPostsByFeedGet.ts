/* eslint-disable no-await-in-loop */
import jwt from 'jsonwebtoken'
import {
    CassandraPost,
    FCassandraPostsByFeedGet,
    postFromItem,
    withHandleAsync
} from 'services'

const cassandraPostsByFeedGet: FCassandraPostsByFeedGet = async (
    params,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    let posts: CassandraPost[] = []

    let postDaysByFeedPageState = ''
    let postsByFeedPageState = ''
    let searching = true
    let cursor = ''
    const pageSize = 2

    if (params.cursor) {
        const cursorData = jwt.decode(params.cursor) as {
            postDaysByFeedPageState: string
            postsByFeedPageState: string
        }

        if (cursorData) {
            postDaysByFeedPageState = cursorData.postDaysByFeedPageState
            postsByFeedPageState = cursorData.postsByFeedPageState
        }
    }

    while (searching) {
        const [
            cassandraPostDaysByFeedError,
            cassandraPostDaysByFeedData
        ] = await cassandraClient.handleExecute(
            `SELECT * FROM post_days_by_feed 
            WHERE feed_id = ?
            AND user_id = ?
            LIMIT ?;`,
            [params.feedId, params.userId, 2],
            {
                prepare: true,
                fetchSize: 1,
                pageState: postDaysByFeedPageState || null
            }
        )

        if (cassandraPostDaysByFeedError)
            throw error({
                message: errorMessages[language].FAILED_TO_GET_FEED
            })

        if (!cassandraPostDaysByFeedData.rows.length) {
            break
        }

        const wantedNumberOfPosts = pageSize - posts.length

        const [
            cassandraPostsByFeedError,
            cassandraPostsByFeedData
        ] = await cassandraClient.handleExecute(
            `SELECT * FROM posts_by_feed 
            WHERE feed_id = ? 
            AND day = ?
            LIMIT ?;`,
            [
                params.feedId,
                cassandraPostDaysByFeedData.rows[0].day,
                wantedNumberOfPosts + 1
            ],
            {
                prepare: true,
                fetchSize: wantedNumberOfPosts,
                pageState: postsByFeedPageState || null
            }
        )

        if (cassandraPostsByFeedError) throw error(cassandraPostsByFeedError)

        posts = [
            ...posts,
            ...cassandraPostsByFeedData.rows.map(row => postFromItem(row))
        ]

        if (
            !cassandraPostsByFeedData.pageState &&
            cassandraPostDaysByFeedData.pageState
        ) {
            postDaysByFeedPageState = cassandraPostDaysByFeedData.pageState
            postsByFeedPageState = ''
        }

        if (cassandraPostsByFeedData.pageState) {
            postsByFeedPageState = cassandraPostsByFeedData.pageState
        }

        if (posts.length >= pageSize) {
            searching = false
        }

        if (
            !cassandraPostsByFeedData.pageState &&
            !cassandraPostDaysByFeedData.pageState
        ) {
            searching = false
            cursor = null
            break
        }

        cursor = jwt.sign(
            {
                postsByFeedPageState,
                postDaysByFeedPageState
            },
            'asjajisoa'
        )
    }

    return {
        posts,
        pageInfo: {
            cursor
        }
    }
}

export default withHandleAsync(cassandraPostsByFeedGet)
