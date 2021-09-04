import { types as cassandraTypes } from 'cassandra-driver'
import moment from 'moment'
import { FCassandraCategoriesByPostCreate, withHandleAsync } from 'services'

const cassandraCategoriesByPostCreate: FCassandraCategoriesByPostCreate = async (
    { categories, post },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    if (!categories || !categories.length)
        return {
            ...post,
            categories: []
        }

    const addCategoriesToPostData = categories.map(categoryItem => ({
        query: `INSERT INTO categories_by_post 
        (
            post_id,
            category_id,
            post_name,
            post_latitude,
            post_longitude,
            post_image,
            post_address,
            post_city,
            post_country,
            post_created_at,
            category_name,
            category_image,
            category_created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        params: [
            post.id,
            categoryItem.id,
            post.name,
            post.location.latitude,
            post.location.longitude,
            post.image,
            post.address,
            post.city,
            post.country,
            post.createdAt,
            categoryItem.name,
            categoryItem.image,
            categoryItem.createdAt
        ]
    }))

    const minuteUuid = cassandraTypes.TimeUuid.fromDate(
        moment().startOf('minute').toDate()
    ).toString()

    const addPostToCategorieMinutesData = categories.map(categoryItem => ({
        query: `INSERT INTO post_minutes_by_category (
            category_id,
            minute_id
        ) VALUES (?, ?);`,
        params: [categoryItem.id, minuteUuid]
    }))

    const addPostToCategorieMinutesLookupData = categories.map(
        categoryItem => ({
            query: `INSERT INTO post_category_lookup (
            category_id,
            post_id,
            minute_id
        ) VALUES (?, ?, ?);`,
            params: [categoryItem.id, post.id, minuteUuid]
        })
    )

    const addPostToCategoriesData = categories.map(categoryItem => ({
        query: `INSERT INTO posts_by_category (
            category_id,
            minute_id,
            post_id,
            category_name,
            category_image,
            category_created_at,
            post_name,
            post_latitude,
            post_longitude,
            post_image,
            post_address,
            post_city,
            post_country,
            post_created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        params: [
            categoryItem.id,
            minuteUuid,
            post.id,
            categoryItem.name,
            categoryItem.image,
            categoryItem.createdAt,
            post.name,
            post.location.latitude,
            post.location.longitude,
            post.image,
            post.address,
            post.city,
            post.country,
            post.createdAt
        ]
    }))

    const [addPostToCategorieDataError] = await cassandraClient.handleBatch(
        [
            ...addPostToCategorieMinutesData,
            ...addPostToCategoriesData,
            ...addCategoriesToPostData,
            ...addPostToCategorieMinutesLookupData
        ],
        {
            prepare: true,
            logged: false
        }
    )

    if (addPostToCategorieDataError)
        throw error({
            message: errorMessages[language].FAILED_TO_CREATE_POST_CATEGORIES
        })

    return {
        ...post,
        categories
    }
}

export default withHandleAsync(cassandraCategoriesByPostCreate)
