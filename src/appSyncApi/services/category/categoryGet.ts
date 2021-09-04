import { FAppSyncCategoryGet } from 'appSyncApi'
import {
    coreCategoryGet,
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

const handler: FAppSyncCategoryGet = async event => {
    const context = await contextReused()
    try {
        const [
            coreCategoryGetError,
            coreCategoryGetData
        ] = await coreCategoryGet(event.arguments.payload, context, {
            language: getLanguage(event),
            headers: event.request.headers
        })

        if (coreCategoryGetError) throw error(coreCategoryGetError)

        return coreCategoryGetData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
