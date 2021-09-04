import { IAppSyncInput } from 'appSyncApi'
import { AppSyncResolverEvent } from 'aws-lambda'
import {
    ICoreOAuth2TokenData,
    ICoreUser,
    ICoreUserKey,
    ICoreUserOAuth2LoginInput,
    ICoreUserOAuth2LoginUrlGetInput,
    ICoreUserOAuth2LogoutInput,
    ICoreUserOAuth2RefreshAccessTokenInput,
    ICoreUserPermissionAssignInput,
    ICoreUserPermissionUnassignInput,
    ICoreUserUpdateInput
} from 'services'

export type FAppSyncUserPermissionAssign = (
    event: IAppSyncInput<ICoreUserPermissionAssignInput>
) => Promise<boolean>

export type FAppSyncUserDelete = (
    event: IAppSyncInput<ICoreUserKey>
) => Promise<ICoreUser>

export type FAppSyncUserGetMe = (
    event: AppSyncResolverEvent<{}>
) => Promise<ICoreUser>

export type FAppSyncUserGet = (
    event: IAppSyncInput<ICoreUserKey>
) => Promise<ICoreUser>

export type FAppSyncUserPermissionUnassign = (
    event: IAppSyncInput<ICoreUserPermissionUnassignInput>
) => Promise<boolean>

export type FAppSyncUserOAuth2Login = (
    event: IAppSyncInput<Omit<ICoreUserOAuth2LoginInput, 'originURI'>>
) => Promise<ICoreUser>

export type FAppSyncUserOAuth2LoginUrlGet = (
    event: IAppSyncInput<Omit<ICoreUserOAuth2LoginUrlGetInput, 'originURI'>>
) => Promise<string>

export type FAppSyncUserOAuth2Logout = (
    event: IAppSyncInput<Omit<ICoreUserOAuth2LogoutInput, 'originURI'>>
) => Promise<boolean>

export type FAppSyncUserOAuth2RefreshAccessToken = (
    event: IAppSyncInput<
        Omit<ICoreUserOAuth2RefreshAccessTokenInput, 'originURI'>
    >
) => Promise<ICoreUser>

export type FAppSyncUserUpdate = (
    event: IAppSyncInput<ICoreUserUpdateInput>
) => Promise<ICoreUser>
