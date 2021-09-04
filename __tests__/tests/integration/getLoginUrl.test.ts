import * as when from 'apiCall'
import { ECoreUserOAuth2Provider, error, handleAsync } from 'services'

describe('Get login url', () => {
    it('Should return google login url', async () => {
        const [getLoginUrlError, getLoginUrlData] = await handleAsync(
            when.weInvokeGetLoginUrl({
                payload: {
                    provider: ECoreUserOAuth2Provider.GOOGLE
                }
            })
        )

        if (getLoginUrlError) throw error(getLoginUrlError)

        expect(getLoginUrlData).not.toBeUndefined()
    })
})
