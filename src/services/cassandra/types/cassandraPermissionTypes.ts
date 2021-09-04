import {
    CassandraCategory,
    CassandraCategoryKey,
    CassandraUser,
    CassandraUserKey,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface CassandraPermissionKey {
    id: string
}

export interface CassandraPermissionConnections {
    category?: CassandraCategory
}

export interface CassandraPermissionKeyData {
    feature: string
    action: string
    categoryName: string
}

export interface CassandraPermissionPreModel
    extends CassandraPermissionConnections {
    id?: string
    feature?: string
    action?: string
}

export interface CassandraPermission extends CassandraPermissionPreModel {
    id: string
    feature: string
    action: string
    categoryName: string
}

export interface ICassandraPermissionsByUser {
    permissions: CassandraPermission[]
    user: CassandraUser
}

export type FCassandraPermissionsByCategoryGet = (
    params: CassandraCategoryKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>

export type FCassandraPermissionsByCategoryCreate = (
    params: CassandraCategory,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>

export type FCassandraPermissionsByCategoryDelete = (
    params: CassandraCategory,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>

export type FCassandraPermissionsByUserGet = (
    params: CassandraUserKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>

export type FCassandraPermissionsByUserCreate = (
    params: ICassandraPermissionsByUser,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraUser>

export type FCassandraPermissionsByUserDelete = (
    params: ICassandraPermissionsByUser,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICassandraPermissionsByUser>

export type FCassandraPermissionsUserGet = (
    params: ICassandraPermissionsByUser,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICassandraPermissionsByUser>
