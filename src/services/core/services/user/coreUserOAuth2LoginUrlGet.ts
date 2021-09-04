import { curry } from 'lodash'
import { FCoreUserOAuth2LoginUrlGet, googleOAuth2UrlGet } from 'services'

const coreUserOAuth2LoginUrlGet: FCoreUserOAuth2LoginUrlGet = async (
    { originURI, provider },
    { error, errorMessages },
    { language }
) => {
    return googleOAuth2UrlGet(
        {
            originURI,
            provider
        },
        { error, errorMessages },
        { language }
    )
}

export default curry(coreUserOAuth2LoginUrlGet)
