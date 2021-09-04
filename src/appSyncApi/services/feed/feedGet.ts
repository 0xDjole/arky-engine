import { FAppSyncFeedGet } from 'appSyncApi'
import {
    coreFeedGet,
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

const handler: FAppSyncFeedGet = async event => {
    const context = await contextReused()
    try {
        const [coreCategoryGetError, coreCategoryGetData] = await coreFeedGet(
            event.arguments.payload,
            context,
            {
                language: getLanguage(event),
                headers: event.request.headers
            }
        )

        if (coreCategoryGetError) throw error(coreCategoryGetError)

        return coreCategoryGetData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
