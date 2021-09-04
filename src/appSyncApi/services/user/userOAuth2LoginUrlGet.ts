import { FAppSyncUserOAuth2LoginUrlGet } from 'appSyncApi'
import {
    coreUserOAuth2LoginUrlGet,
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

const handler: FAppSyncUserOAuth2LoginUrlGet = async event => {
    const context = await contextReused()

    try {
        const { origin } = event.request.headers

        const [
            coreUserOAuth2LoginUrlGetError,
            coreUserOAuth2LoginUrlGetData
        ] = await handleAsync(
            coreUserOAuth2LoginUrlGet(
                {
                    provider: event.arguments.payload.provider,
                    originURI: origin
                },
                context,
                {
                    language: getLanguage(event)
                }
            )
        )

        if (coreUserOAuth2LoginUrlGetError)
            throw error(coreUserOAuth2LoginUrlGetError)

        return coreUserOAuth2LoginUrlGetData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
