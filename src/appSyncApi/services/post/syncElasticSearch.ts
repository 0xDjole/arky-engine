import { FAppSyncElasticSearch } from 'appSyncApi'
import {
    error,
    errorMessages,
    handleAsync,
    initCassandraClient,
    initElasticSearch,
    initLogger,
    syncElasticSearchService
} from 'services'

const contextReused = () => ({
    logger: initLogger(),
    elasticSearchClient: initElasticSearch(),
    cassandraClient: initCassandraClient(),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncElasticSearch = async event => {
    const context = contextReused()
    try {
        const [
            syncElasticSearchServiceError,
            syncElasticSearchServiceData
        ] = await syncElasticSearchService(event, context, {
            language: 'en-US'
        })

        if (syncElasticSearchServiceError)
            throw error(syncElasticSearchServiceError)

        return syncElasticSearchServiceData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
