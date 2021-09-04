import { FAppSyncCategoryCreate } from 'appSyncApi'
import {
    coreCategoryCreate,
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

const handler: FAppSyncCategoryCreate = async event => {
    const context = await contextReused()

    try {
        const [
            coreCategoryCreateError,
            coreCategoryCreateData
        ] = await coreCategoryCreate(event.arguments.payload, context, {
            language: getLanguage(event),
            headers: event.request.headers
        })

        if (coreCategoryCreateError)
            throw error({
                name: coreCategoryCreateError.name,
                message: coreCategoryCreateError.message,
                logger: context.logger
            })

        return coreCategoryCreateData
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
