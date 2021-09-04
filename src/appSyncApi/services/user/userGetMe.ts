import { FAppSyncUserGetMe } from 'appSyncApi'
import {
    coreUserGetMe,
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

const handler: FAppSyncUserGetMe = async event => {
    const context = await contextReused()

    try {
        const [coreUserGetMeError, coreUserGetMeData] = await coreUserGetMe(
            event.request.headers.authorization,
            context,
            {
                language: getLanguage(event)
            }
        )

        if (coreUserGetMeError) throw error(coreUserGetMeError)

        return coreUserGetMeData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
