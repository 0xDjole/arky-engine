import { FAppSyncUserOAuth2Logout } from 'appSyncApi'
import {
    coreUserOAuth2Logout,
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

const handler: FAppSyncUserOAuth2Logout = async event => {
    const context = await contextReused()

    const { token, provider } = event.arguments.payload
    try {
        const { origin } = event.request.headers

        const [
            coreUserOAuth2LogoutError,
            coreUserOAuth2LogoutData
        ] = await coreUserOAuth2Logout(
            {
                token,
                originURI: origin,
                provider
            },
            context,
            {
                language: getLanguage(event)
            }
        )

        if (coreUserOAuth2LogoutError) throw error(coreUserOAuth2LogoutError)

        return coreUserOAuth2LogoutData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
