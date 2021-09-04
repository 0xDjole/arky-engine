import { FAppSyncPostGet } from 'appSyncApi'
import {
    corePostGet,
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

const handler: FAppSyncPostGet = async event => {
    const context = contextReused()

    try {
        const [corePostGetError, corePostGetData] = await corePostGet(
            event.arguments.payload,
            context,
            {
                language: getLanguage(event)
            }
        )

        if (corePostGetError) throw error(corePostGetError)

        return corePostGetData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
