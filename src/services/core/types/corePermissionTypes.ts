import { ICoreCategory, ICoreUser, ICoreUserKey } from 'services'

export interface ICorePermissionKey {
    id: string
}

export interface ICorePermissionConnections {
    category?: ICoreCategory
}

export interface ICorePermissionKeyData {
    feature: string
    action: string
    categoryName: string
}

export interface ICorePermissionPreModel extends ICorePermissionConnections {
    id?: string
    feature?: string
    action?: string
    categoryName?: string
}

export interface ICorePermission extends ICorePermissionPreModel {
    id: string
    feature: string
    action: string
    categoryName: string
}

export interface IICorePermissionsByUser {
    permissions: ICorePermission[]
    user: ICoreUser
}

export interface IICorePermissionsByUserGetInput {
    userKey: ICoreUserKey
    minuteId: string
}
