import * as when from 'apiCall'
import { ECoreUserOAuth2Provider, error, handleAsync } from 'services'

describe('Logout OAuth2', () => {
    it('Should logout', async () => {
        const [logoutOAuth2Error, logoutOAuth2Data] = await handleAsync(
            when.weInvokeOAuth2Logout({
                payload: {
                    token: process.env.GOOGLE_REFRESH_ACCESS_TOKEN,
                    provider: ECoreUserOAuth2Provider.GOOGLE
                }
            })
        )

        if (logoutOAuth2Error) throw error(logoutOAuth2Error)

        expect(logoutOAuth2Data).not.toBeUndefined()
    })
})
