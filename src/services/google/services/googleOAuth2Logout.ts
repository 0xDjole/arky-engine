import axios from 'axios'
import querystring from 'querystring'
import { IGoogleOAuth2Logout } from 'services'

const googleOAuth2Logout: IGoogleOAuth2Logout = async (
    { token, originURI, provider },
    { error, errorMessages, handleAsync },
    { language }
) => {
    const googleAuthorizedOriginURIS = JSON.parse(
        process.env.GOOGLE_AUTHORIZED_ORIGIN_URIS
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

    const url = 'https://oauth2.googleapis.com/revoke'

    const values = {
        token
    }

    const [googleApiAuthTokenError] = await handleAsync(
        axios.post(url, querystring.stringify(values), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    )

    if (googleApiAuthTokenError)
        throw error({
            name: 'Error',
            message: errorMessages[language].FAILED_TO_LOGOUT
        })

    return true
}

export default googleOAuth2Logout
