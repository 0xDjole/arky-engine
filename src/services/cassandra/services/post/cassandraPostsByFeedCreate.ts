import { FCassandraPostsByFeedCreate, withHandleAsync } from 'services'

const cassandraPostsByFeedCreate: FCassandraPostsByFeedCreate = async (
    params,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const categoriesByFeedData = params.post.categories.map(categoryItem => ({
        query: `INSERT INTO categories_by_feed (
            feed_id,
            category_id
        ) VALUES (?, ?)`,
        params: [params.feedId, categoryItem.id]
    }))

    const feedsByCategoryAndUser = params.post.categories.map(categoryItem => ({
        query: `INSERT INTO feeds_by_category_and_user (
            user_id,
            category_id,
            feed_id
        ) VALUES (?, ?, ?)`,
        params: [params.userId, categoryItem.id, params.feedId]
    }))

    const postDaysByFeedData = {
        query: `INSERT INTO post_days_by_feed (
            feed_id,
            user_id,
            day
        ) VALUES (?, ?, ?)`,
        params: [params.feedId, params.userId, params.day]
    }

    const feedDaysByPostData = {
        query: `INSERT INTO feed_days_by_post (
            post_id,
            day
        ) VALUES (?, ?)`,
        params: [params.post.id, params.day]
    }

    const feedsByPost = {
        query: `INSERT INTO feeds_by_post (
            post_id,
            day,
            feed_id,
            user_id
        ) VALUES (?, ?, ?, ?)`,
        params: [params.post.id, params.day, params.feedId, params.userId]
    }

    const cassandraPostByFeedCreateData = params.post.categories.map(
        categoryItem => ({
            query: `INSERT INTO posts_by_feed (
            feed_id,
            day,
            post_id,
            post_name,
            post_latitude,
            post_longitude,
            post_image,
            post_address,
            post_city,
            post_country,
            post_created_at,
            post_category_id,
            post_category_name,
            post_category_image,
            post_category_created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            params: [
                params.feedId,
                params.day,
                params.post.id,
                params.post.name,
                params.post.location.latitude,
                params.post.location.longitude,
                params.post.image,
                params.post.address,
                params.post.city,
                params.post.country,
                params.post.createdAt,
                categoryItem.id,
                categoryItem.name,
                categoryItem.image,
                categoryItem.createdAt
            ]
        })
    )

    const [cassandraPostsByFeedCreateError] = await cassandraClient.handleBatch(
        [
            postDaysByFeedData,
            feedDaysByPostData,
            feedsByPost,
            ...cassandraPostByFeedCreateData,
            ...feedsByCategoryAndUser,
            ...categoriesByFeedData
        ],
        {
            prepare: true,
            logged: false
        }
    )

    if (cassandraPostsByFeedCreateError)
        throw error({
            message: errorMessages[language].FAILED_TO_CREATE_POST_FEED
        })

    return params.post
}

export default withHandleAsync(cassandraPostsByFeedCreate)
