import { types as CassandraTypes } from 'cassandra-driver'
import moment from 'moment'
import {
    CassandraCategory,
    CassandraCategoryConnections,
    CassandraCategoryKey,
    CassandraCategoryKeyData,
    CassandraCategoryPreModel,
    CassandraCategoryWithPosts,
    getTypeData,
    postFromItem
} from 'services'

export const toCategoryId = (categoryKey: CassandraCategoryKeyData): string =>
    `CATEGORY#${categoryKey.name.toLowerCase()}`

export const toCategoryKeyData = (
    categoryKey: CassandraCategoryKey
): CassandraCategoryKeyData => {
    const data = categoryKey.id.split('#')

    return {
        name: data[1]
    }
}

export const cassandraCategoryModel = (
    category: CassandraCategoryPreModel,
    connections?: CassandraCategoryConnections
): CassandraCategory => {
    let categoryModelData: CassandraCategory = {
        id: toCategoryId({ name: category.name }),
        name: category.name,
        image: category.image || '',
        createdAt: category.createdAt || moment().toDate()
    }

    if (
        connections &&
        connections.permissions &&
        connections.permissions.length
    ) {
        categoryModelData = {
            ...categoryModelData,
            permissions: connections.permissions
        }
    }

    return categoryModelData
}

export const categoryFromItem = (
    item: CassandraTypes.Row
): CassandraCategory => {
    const parsedItem = getTypeData(item, 'category')

    if (!parsedItem) {
        return null
    }

    const category = cassandraCategoryModel({
        name: parsedItem.name,
        createdAt: moment(parsedItem.created_at).toDate()
    })

    if (parsedItem.image) {
        category.image = parsedItem.image
    }

    return category
}
