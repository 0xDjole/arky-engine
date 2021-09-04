import * as when from 'apiCall'
import { ECoreUserOAuth2Provider, error, handleAsync } from 'services'

describe('Get Me', () => {
    it('Should return my profile', async () => {
        const [
            refreshAccessTokenError,
            refreshAccessTokenData
        ] = await handleAsync(
            when.weInvokeOAuth2RefreshAccessToken({
                payload: {
                    refreshToken: process.env.GOOGLE_REFRESH_ACCESS_TOKEN,
                    provider: ECoreUserOAuth2Provider.GOOGLE
                }
            })
        )

        if (refreshAccessTokenError) throw error(refreshAccessTokenError)

        const [userError, user] = await handleAsync(
            when.aUserCallsGetMe(refreshAccessTokenData.token.openIdToken)
        )

        if (userError) throw error(userError)

        expect(user).toMatchObject({
            email: process.env.OWNER_EMAIL
        })
    })
})
