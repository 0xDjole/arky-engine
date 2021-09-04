import { FAppSyncCategoryUpdate } from 'appSyncApi'
import {
    coreCategoryUpdate,
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

const handler: FAppSyncCategoryUpdate = async event => {
    const context = await contextReused()

    try {
        const [
            coreCategoryUpdateError,
            coreCategoryUpdateData
        ] = await coreCategoryUpdate(event.arguments.payload, context, {
            language: getLanguage(event),
            headers: event.request.headers
        })

        if (coreCategoryUpdateError)
            throw error({
                name: coreCategoryUpdateError.name,
                message: coreCategoryUpdateError.message,
                logger: context.logger
            })

        return coreCategoryUpdateData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        context.kafkaProducer.disconnect()
        context.cassandraClient.shutdown()
    }
}

export { handler }
