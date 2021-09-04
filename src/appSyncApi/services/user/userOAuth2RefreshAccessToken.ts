import { FAppSyncUserOAuth2RefreshAccessToken } from 'appSyncApi'
import {
    coreUserOAuth2RefreshAccessToken,
    error,
    errorMessages,
    getLanguage,
    handleAsync,
    initCassandraClient,
    initLogger
} from 'services'

const contextReused = () => ({
    logger: initLogger(),
    cassandraClient: initCassandraClient(),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncUserOAuth2RefreshAccessToken = async event => {
    const context = await contextReused()

    const { refreshToken, provider } = event.arguments.payload
    try {
        const { origin } = event.request.headers

        const [
            coreUserOAuth2RefreshAccessTokenError,
            coreUserOAuth2RefreshAccessTokenData
        ] = await coreUserOAuth2RefreshAccessToken(
            {
                refreshToken,
                originURI: origin,
                provider
            },
            context,
            {
                language: getLanguage(event)
            }
        )

        if (coreUserOAuth2RefreshAccessTokenError)
            throw error(coreUserOAuth2RefreshAccessTokenError)

        return coreUserOAuth2RefreshAccessTokenData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
