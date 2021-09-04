import {
    ICoreUserOAuth2LoginInput,
    ICoreUserOAuth2LoginUrlGetInput,
    ICoreUserOAuth2LogoutInput,
    ICoreUserOAuth2RefreshAccessTokenInput,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface IGoogleOAuth2TokenData {
    openIdToken: string
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
    scope: string
}

export type IGoogleOAuth2Login = (
    params: ICoreUserOAuth2LoginInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<IGoogleOAuth2TokenData>

export type IGoogleOAuth2Logout = (
    params: ICoreUserOAuth2LogoutInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type IGoogleOAuth2RefreshAccessToken = (
    params: ICoreUserOAuth2RefreshAccessTokenInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<IGoogleOAuth2TokenData>

export type IGoogleOAuth2UrlGet = (
    params: ICoreUserOAuth2LoginUrlGetInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => string
