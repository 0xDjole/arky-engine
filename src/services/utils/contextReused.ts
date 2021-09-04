import {
    error,
    errorMessages,
    handleAsync,
    initCassandraClient,
    initElasticSearch,
    initLogger,
    IServiceContextReused
} from 'services'

const contextReused = async (): Promise<IServiceContextReused> => ({
    logger: initLogger(),
    elasticSearchClient: initElasticSearch(),
    cassandraClient: initCassandraClient(),
    error,
    errorMessages,
    handleAsync
})

export default contextReused
