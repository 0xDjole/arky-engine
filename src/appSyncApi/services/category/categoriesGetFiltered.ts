import { FAppSyncCategoriesGetFiltered } from 'appSyncApi'
import {
    coreCategoriesGetFiltered,
    error,
    errorMessages,
    getLanguage,
    handleAsync,
    initElasticSearch,
    initLogger
} from 'services'

const contextReused = () => ({
    logger: initLogger(),
    elasticSearchClient: initElasticSearch(),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncCategoriesGetFiltered = async event => {
    const { payload } = event.arguments
    const context = contextReused()
    const [
        coreCategoriesGetFilteredError,
        coreCategoriesGetFilteredData
    ] = await coreCategoriesGetFiltered(payload, context, {
        language: getLanguage(event),
        headers: event.request.headers
    })

    if (coreCategoriesGetFilteredError)
        throw error(coreCategoriesGetFilteredError)

    return coreCategoriesGetFilteredData
}

export { handler }
