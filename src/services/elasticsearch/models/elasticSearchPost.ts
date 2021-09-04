import moment from 'moment'
import {
    ICorePost,
    ICorePostConnections,
    IElasticSearchPost,
    toCategoryId
} from 'services'

export const elasticSearchToPost = (post: IElasticSearchPost): ICorePost => {
    return {
        id: post.id,
        name: post.name,
        image: post.image,
        country: post.country,
        address: post.address,
        city: post.city,
        categories: post.categories,
        location: {
            latitude: post.location.lat,
            longitude: post.location.lon
        },
        createdAt: post.createdAt
    }
}

export const postToDoc = (
    post: ICorePost,
    connections?: ICorePostConnections
): IElasticSearchPost => {
    let postModelData: IElasticSearchPost = {
        id: `POST#${post.name.toLowerCase()}#${post.location.latitude}#${
            post.location.longitude
        }`,
        name: post.name,
        image: post.image || '',
        createdAt: post.createdAt || moment().toDate(),
        location: {
            lat: post.location.latitude,
            lon: post.location.longitude
        },
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
            categories: connections.categories.map(categoryItem => ({
                ...categoryItem,
                id: toCategoryId({ name: categoryItem.name })
            }))
        }
    } else {
        postModelData = {
            ...postModelData,
            categories: []
        }
    }

    return postModelData
}
