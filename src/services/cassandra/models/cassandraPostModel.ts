import { types as CassandraTypes } from 'cassandra-driver'
import moment from 'moment'
import {
    CassandraPost,
    CassandraPostConnections,
    CassandraPostKey,
    CassandraPostKeyData,
    CassandraPostPreModel,
    error,
    errorMessages
} from 'services'

import { getTypeData } from '../services'

export const toPostId = (postKey: CassandraPostKeyData): string =>
    `POST#${postKey.name.toLowerCase()}#${postKey.location.latitude}#${
        postKey.location.longitude
    }`

export const toPostKeyData = (
    postKey: CassandraPostKey
): CassandraPostKeyData => {
    const data = postKey.id.split('#')

    return {
        name: data[1],
        location: {
            latitude: parseFloat(data[2]),
            longitude: parseFloat(data[3])
        }
    }
}

export const cassandraPostModel = (
    post: CassandraPostPreModel,
    language: string,
    connections?: CassandraPostConnections
): CassandraPost => {
    if (
        !post.name ||
        !post.location ||
        !post.location.longitude ||
        !post.location.latitude
    )
        throw error({
            message: errorMessages[language].MISSING_DATA_FOR_POST_MODEL
        })

    let postModelData: CassandraPost = {
        id: toPostId({
            name: post.name,
            location: post.location
        }),
        name: post.name,
        location: post.location,
        image: post.image || '',
        createdAt: post.createdAt || moment().toDate(),
        address: post.address,
        city: post.city,
        country: post.country
    }

    if (
        connections &&
        connections.categories &&
        connections.categories.length
    ) {
        postModelData = {
            ...postModelData,
            categories: connections.categories
        }
    }

    return postModelData
}

export const postFromItem = (
    item: CassandraTypes.Row,
    language = 'en-US'
): CassandraPost => {
    const parsedItem = getTypeData(item, 'post')

    if (
        !parsedItem.name ||
        !parsedItem.latitude ||
        !parsedItem.longitude ||
        !parsedItem.created_at
    )
        throw error({
            message: errorMessages[language].NOT_A_VALID_POST_ITEM
        })

    const post = cassandraPostModel(
        {
            name: parsedItem.name,
            location: {
                latitude: +parsedItem.latitude,
                longitude: +parsedItem.longitude
            },
            createdAt: moment(parsedItem.created_at).toDate()
        },
        'en-US'
    )

    if (parsedItem.image && parsedItem.image) {
        post.image = parsedItem.image
    }

    if (parsedItem.address && parsedItem.address) {
        post.address = parsedItem.address
    }

    if (parsedItem.city && parsedItem.city) {
        post.city = parsedItem.city
    }
    if (parsedItem.country && parsedItem.country) {
        post.country = parsedItem.country
    }

    return post
}
