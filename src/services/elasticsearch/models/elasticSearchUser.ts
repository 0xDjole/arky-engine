import moment from 'moment'
import {
    ICoreUser,
    ICoreUserConnections,
    IElasticSearchUser,
    toUserId
} from 'services'

export const userToDoc = (
    user: ICoreUser,
    connections?: ICoreUserConnections
): IElasticSearchUser => {
    let userModelData: IElasticSearchUser = {
        id: toUserId(user),
        email: user.email,
        name: user.name,
        image: user.image || '',
        createdAt: user.createdAt || moment().toDate()
    }

    if (
        connections &&
        connections.permissions &&
        connections.permissions.length
    ) {
        userModelData = {
            ...userModelData,
            permissions: connections.permissions
        }
    } else {
        userModelData = {
            ...userModelData,
            permissions: []
        }
    }

    return userModelData
}
