import * as when from 'apiCall'
import { ECoreUserOAuth2Provider, error, handleAsync } from 'services'

describe('Login o auth 2', () => {
    it('Should return login o auth 2 data', async () => {
        const [getLoginUrlError, getLoginUrlData] = await handleAsync(
            when.weInvokeOAuth2Login({
                payload: {
                    code:
                        '4/0AY0e-g7Vn1rVmqkb__YRz8LFGIWtWNag3yI7LZizObKSX8fk-IwWK2EwKrMMFi-rX-CVmw',
                    provider: ECoreUserOAuth2Provider.GOOGLE
                }
            })
        )

        if (getLoginUrlError) throw error(getLoginUrlError)

        console.log(getLoginUrlData)
        expect(getLoginUrlData).not.toBeUndefined()
    })
})
