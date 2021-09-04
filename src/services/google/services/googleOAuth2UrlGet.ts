import querystring from 'querystring'
import { IGoogleOAuth2UrlGet } from 'services'

const googleUrlGet: IGoogleOAuth2UrlGet = (
    { originURI, provider },
    { error, errorMessages },
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

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri: googleAuthorizedRedirectURIS.find(redirectURI =>
            redirectURI.startsWith(originURI)
        ),
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: ['openid', 'profile', 'email'].join(' ')
    }

    const qsOptions = querystring.stringify(options)

    return `${rootUrl}?${qsOptions}`
}

export default googleUrlGet
