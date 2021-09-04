import { FAppSyncPostDelete } from 'appSyncApi'
import {
    corePostDelete,
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

const handler: FAppSyncPostDelete = async event => {
    const context = await contextReused()
    try {
        const [corePostDeleteError, corePostDeleteData] = await corePostDelete(
            event.arguments.payload,
            context,
            {
                language: getLanguage(event),
                headers: event.request.headers
            }
        )

        if (corePostDeleteError) throw error(corePostDeleteError)

        return corePostDeleteData
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
