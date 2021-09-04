import axios from 'axios'
import querystring from 'querystring'
import { IGoogleOAuth2Login } from 'services'

const googleOAuth2Login: IGoogleOAuth2Login = async (
    { code, originURI, provider },
    { error, errorMessages, handleAsync },
    { language }
) => {
    const googleAuthorizedOriginURIS = JSON.parse(
        process.env.GOOGLE_AUTHORIZED_ORIGIN_URIS
    ) as string[]

    const googleAuthorizedRedirectURIS = JSON.parse(
        process.env.GOOGLE_AUTHORIZED_REDIRECT_URIS
    ) as string[]

    if (!googleAuthorizedOriginURIS.includes(originURI))
        throw error({
            name: 'Error',
            message: errorMessages[language].INVALID_ORIGIN_URI
        })

    if (provider !== 'GOOGLE') {
        throw error({
            name: 'Error',
            message: errorMessages[language].UNSUPPORTED_LOGIN_TYPE
        })
    }

    const url = 'https://oauth2.googleapis.com/token'
    const values = {
        code,
        scopes: ['openid', 'email', 'profile'].join(' '),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: googleAuthorizedRedirectURIS.find(redirectURI =>
            redirectURI.startsWith(originURI)
        ),
        grant_type: 'authorization_code'
    }

    const [googleApiAuthTokenError, googleApiAuthTokenData] = await handleAsync(
        axios.post(url, querystring.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    )

    if (googleApiAuthTokenError)
        throw error({
            name: 'Error',
            message: errorMessages[language].FAILED_TO_FETCH_AUTH_TOKENS
        })

    const tokenData = googleApiAuthTokenData.data

    return {
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
        refreshToken: tokenData.refresh_token,
        scope: tokenData.scope,
        tokenType: tokenData.token_type,
        openIdToken: tokenData.id_token
    }
}

export default googleOAuth2Login
