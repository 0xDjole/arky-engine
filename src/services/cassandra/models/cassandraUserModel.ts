import { types as CassandraTypes } from 'cassandra-driver'
import moment from 'moment'
import {
    CassandraUser,
    CassandraUserKey,
    CassandraUserKeyData,
    CassandraUserPreModel,
    getTypeData
} from 'services'

export const toUserId = (userKey: CassandraUserKeyData): string =>
    `USER#${userKey.email.toLowerCase()}`

export const toUserKeyData = (
    categoryKey: CassandraUserKey
): CassandraUserKeyData => {
    const data = categoryKey.id.split('#')

    return {
        email: data[1]
    }
}

export const userModel = (user: CassandraUserPreModel): CassandraUser => ({
    id: toUserId({ email: user.email }),
    email: user.email,
    name: user.name || '',
    image: user.image || '',
    createdAt: user.createdAt || moment().toDate()
})

export const userFromItem = (item: CassandraTypes.Row): CassandraUser => {
    const parsedItem = getTypeData(item, 'user')

    const user = userModel({
        email: parsedItem.email,
        name: parsedItem.name,
        createdAt: moment(parsedItem.created_at).toDate()
    })

    if (parsedItem.image) {
        user.image = parsedItem.image
    }

    return user
}
