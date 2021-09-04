export interface ICoreUserAccessTokenKey {
    accessToken: string
}

export interface ICoreUserToken extends ICoreUserAccessTokenKey {
    provider: string
    openIdToken: string
    refreshToken: string
    tokenType: string
    expiresAt: Date
    scope: string
}
