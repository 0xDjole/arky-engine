import { FCoreLanguageGet } from 'services'

const supportedLanguages = ['en-US']

const getLanguage: FCoreLanguageGet = event => {
    const language =
        event.request.headers.headers &&
        event.request.headers['Accept-Language']
            ? event.request.headers['Accept-Language']
            : 'en-US'

    if (!supportedLanguages.includes(language)) {
        return 'en-US'
    }

    return language
}

export default getLanguage
