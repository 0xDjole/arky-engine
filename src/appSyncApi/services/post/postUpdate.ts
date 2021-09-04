import { FAppSyncPostUpdate } from 'appSyncApi'
import {
    corePostUpdate,
    error,
    errorMessages,
    getLanguage,
    handleAsync,
    initCassandraClient,
    initKafka,
    initKafkaProducer,
    initLogger
} from 'services'

const contextReused = async () => ({
    logger: initLogger(),
    cassandraClient: initCassandraClient(),
    kafkaProducer: await initKafkaProducer(initKafka()),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncPostUpdate = async event => {
    const context = await contextReused()
    try {
        const [corePostUpdateError, corePostUpdateData] = await corePostUpdate(
            event.arguments.payload,
            context,
            {
                language: getLanguage(event)
            }
        )

        if (corePostUpdateError) throw error(corePostUpdateError)

        return corePostUpdateData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        context.kafkaProducer.disconnect()
        context.cassandraClient.shutdown()
    }
}

export { handler }
