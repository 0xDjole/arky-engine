import { FAppSyncUserOAuth2Login } from 'appSyncApi'
import {
    coreUserOAuth2Login,
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

const handler: FAppSyncUserOAuth2Login = async event => {
    const context = await contextReused()

    const { code, provider } = event.arguments.payload
    try {
        const { origin } = event.request.headers

        const [
            coreUserOAuth2LoginError,
            coreUserOAuth2LoginData
        ] = await coreUserOAuth2Login(
            {
                code,
                originURI: origin,
                provider
            },
            context,
            {
                language: getLanguage(event)
            }
        )

        if (coreUserOAuth2LoginError) throw error(coreUserOAuth2LoginError)

        return coreUserOAuth2LoginData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
