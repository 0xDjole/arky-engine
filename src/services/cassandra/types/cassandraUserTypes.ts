import {
    CassandraPermission,
    CassandraPermissionKey,
    IPermissionMap,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface CassandraUserAccessTokenKey {
    accessToken: string
}

export interface CassandraUserToken extends CassandraUserAccessTokenKey {
    provider: string
    openIdToken: string
    refreshToken: string
    tokenType: string
    expiresAt: Date
    scope: string
}

export interface CassandraUserConnections {
    permissions?: CassandraPermission[]
    token?: CassandraUserToken
}

export interface CassandraUserKey {
    id: string
}

export interface CassandraUserKeyData {
    email: string
}

export interface CassandraUserPreModel extends CassandraUserKeyData {
    id?: string
    name?: string
    image?: string
    createdAt?: Date
}

export interface CassandraUser
    extends CassandraUserPreModel,
        CassandraUserConnections {
    id: string
    createdAt: Date
}

export interface CassandraUserInput {
    email: string
    name?: string
    image?: string
}

export interface CassandraUserUpdateData {
    name: string
    image: string
}

export interface CassandraUserUpdateInput {
    userKeyData: CassandraUserKey
    updateUserData: CassandraUserUpdateData
}

export interface CassandraUserTokenCreateInput {
    user: CassandraUser
    token: CassandraUserToken
}

export enum EUserTokenType {
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    ACCESS_TOKEN = 'ACCESS_TOKEN'
}
export interface CassandraUserTokenGetInput {
    type: EUserTokenType
    value: string
    permissionIds: string[]
}

export type CassandraUserTokenDeleteInput = CassandraUserTokenGetInput

export type FCassandraUserAuthentication = <T, P>(
    callback: (
        params: P,
        contextReused: IServiceContextReused,
        context: IServiceContext
    ) => Promise<T>
) => (
    params: P,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<T>

export type FCassandraUserAuthorizaton = <T, P>(
    callback: (
        params: P,
        contextReused: IServiceContextReused,
        context: IServiceContext
    ) => Promise<T>,
    validator: (
        params: P,
        contextReused: IServiceContextReused,
        context: IServiceContext
    ) => Promise<IPermissionMap>
) => (
    params: P,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<T>

export type FCassandraUserTokenCreate = (
    params: CassandraUserTokenCreateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>

export type FCassandraUserTokenDelete = (
    params: CassandraUserTokenDeleteInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type FCassandraUserTokenGet = (
    params: CassandraUserTokenGetInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>

export type FCassandraUserCreate = (
    params: CassandraUserInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>

export type FCassandraUserDelete = (
    params: CassandraUserKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>

export type FCassandraUserGet = (
    params: CassandraUserKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>

export type FCassandraUsersByPermissionGet = (
    params: CassandraPermissionKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser[]>

export type FCassandraUserUpdate = (
    params: CassandraUserUpdateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>
