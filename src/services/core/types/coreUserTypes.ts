import {
    EUserTokenType,
    ICorePermission,
    ICoreUserToken,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface ICoreUserConnections {
    permissions?: ICorePermission[]
    token?: ICoreUserToken
}

export interface ICoreOAuth2TokenData {
    provider: string
    openIdToken: string
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresAt: Date
    scope: string
}

export interface ICoreUserKey {
    id: string
}

export interface ICoreUserKeyData {
    email: string
}

export interface ICoreUserPreModel extends ICoreUserKeyData {
    id?: string
    name?: string
    image?: string
    createdAt?: Date
}

export interface ICoreUser extends ICoreUserPreModel, ICoreUserConnections {
    id: string
    createdAt: Date
}

export enum ECoreUserOAuth2Provider {
    GOOGLE = 'GOOGLE'
}

export interface ICoreOAuth2IdTokenParsed {
    email: string
    name: string
    picture: string
}

export interface ICoreUserPermissionAssignInput {
    email: string
    permissionIds: string[]
}

export interface ICoreUserPermissionUnassignInput {
    email: string
    permissionIds: string[]
}

export interface ICoreUserOAuth2LoginUrlGetInput {
    originURI: string
    provider: ECoreUserOAuth2Provider
}

export interface ICoreUserOAuth2LogoutInput {
    token: string
    originURI: string
    provider: ECoreUserOAuth2Provider
}

export interface ICoreUserOAuth2LoginInput {
    code: string
    originURI: string
    provider: ECoreUserOAuth2Provider
}
export interface ICoreUserOAuth2RefreshAccessTokenInput {
    refreshToken: string
    originURI: string
    provider: ECoreUserOAuth2Provider
}

export interface ICoreUserUpdateData {
    name: string
    image: string
}

export interface ICoreUserUpdateInput {
    userKeyData: ICoreUserKey
    updateUserData: ICoreUserUpdateData
}

export type FCoreUserDelete = (
    params: ICoreUserKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreUser>

export type FCoreUserGetMe = (
    params: string,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreUser>

export type FCoreUserPermissionAssign = (
    params: ICoreUserPermissionAssignInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type FCoreUserPermissionUnassign = (
    params: ICoreUserPermissionUnassignInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type FCoreUserOAuth2Login = (
    params: ICoreUserOAuth2LoginInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreUser>

export type FCoreUserOAuth2RefreshAccessToken = (
    params: ICoreUserOAuth2RefreshAccessTokenInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreUser>

export type FCoreUserOAuth2LoginUrlGet = (
    params: ICoreUserOAuth2LoginUrlGetInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<string>

export type FCoreUserOAuth2Logout = (
    params: ICoreUserOAuth2LogoutInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type FCoreUserUpdate = (
    params: ICoreUserUpdateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreUser>
