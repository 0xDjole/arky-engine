import { FAppSyncPostCreate } from 'appSyncApi'
import {
    corePostCreate,
    error,
    errorMessages,
    getLanguage,
    handleAsync,
    initCassandraClient,
    initElasticSearch,
    initKafka,
    initKafkaProducer,
    initLogger,
    IServiceContextReused
} from 'services'

const contextReused = async (): Promise<IServiceContextReused> => ({
    logger: initLogger(),
    cassandraClient: initCassandraClient(),
    elasticSearchClient: initElasticSearch(),
    kafkaProducer: await initKafkaProducer(initKafka()),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncPostCreate = async event => {
    const context = await contextReused()

    try {
        const [corePostCreateError, corePostCreateData] = await corePostCreate(
            event.arguments.payload,
            context,
            {
                language: getLanguage(event),
                headers: event.request.headers
            }
        )

        if (corePostCreateError) throw error(corePostCreateError)

        return corePostCreateData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        if (context.cassandraClient) {
            context.cassandraClient.shutdown()
        }
        if (context.kafkaProducer) {
            context.kafkaProducer.disconnect()
        }
    }
}

export { handler }
