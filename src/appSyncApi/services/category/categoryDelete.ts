import { FAppSyncCategoryDelete } from 'appSyncApi'
import {
    coreCategoryDelete,
    error,
    errorMessages,
    getLanguage,
    handleAsync,
    initCassandraClient,
    initKafka,
    initKafkaProducer,
    initLogger,
    IServiceContextReused
} from 'services'

const contextReused = async (): Promise<IServiceContextReused> => ({
    logger: initLogger(),
    cassandraClient: initCassandraClient(),
    kafkaProducer: await initKafkaProducer(initKafka()),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncCategoryDelete = async event => {
    const context = await contextReused()
    try {
        const [
            coreCategoryDeleteError,
            coreCategoryDeleteData
        ] = await coreCategoryDelete(event.arguments.payload, context, {
            language: getLanguage(event),
            headers: event.request.headers
        })

        if (coreCategoryDeleteError) throw error(coreCategoryDeleteError)

        return coreCategoryDeleteData
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
