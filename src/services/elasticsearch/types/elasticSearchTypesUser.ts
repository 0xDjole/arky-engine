import {
    IElasticSearchPermission,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface IElasticSearchUserKeyData {
    email: string
}

export interface IElasticSearchUserInput extends IElasticSearchUserKeyData {
    name?: string
    image?: string
}

export interface IElasticSearchUserPreModel extends IElasticSearchUserInput {
    id?: string
    name?: string
    image?: string
    createdAt?: Date
}

export interface IElasticSearchUserConnections {
    permissions?: IElasticSearchPermission[]
}

export interface IElasticSearchUser
    extends IElasticSearchUserPreModel,
        IElasticSearchUserConnections {
    id: string
    createdAt: Date
}

export interface IElasticSearchUserDeleteInput {
    id: string
}

export interface IElasticSearchUsersGetInput {
    permissionIds: string[]
    matchAll: boolean
}

export interface IElasticSearchUserPermissionCreateInput {
    id: string
    permissions: IElasticSearchPermission[]
}

export interface IElasticSearchUserPermissionDeleteInput {
    id: string
    permission: IElasticSearchPermission
}

export interface IElasticSearchUserUpsertInput {
    user: IElasticSearchUser
}

export type FElasticSearchUserDelete = (
    params: IElasticSearchUserDeleteInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchUsersGet = (
    params: IElasticSearchUsersGetInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<IElasticSearchUser[]>

export type FElasticSearchUserPermissionCreate = (
    params: IElasticSearchUserPermissionCreateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchUserPermissionDelete = (
    params: IElasticSearchUserPermissionDeleteInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchUserUpsert = (
    params: IElasticSearchUserUpsertInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>
