import * as when from 'apiCall'
import { ECoreUserOAuth2Provider, error, handleAsync } from 'services'

describe('Login o auth 2', () => {
    it('Should return login o auth 2 data', async () => {
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

        expect(refreshAccessTokenData).not.toBeUndefined()
    })
})
