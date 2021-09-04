import { FAppSyncPostGetRandom } from 'appSyncApi'
import { curry } from 'lodash'
import {
    corePostGetRandom,
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

const handler: FAppSyncPostGetRandom = async event => {
    const context = contextReused()

    try {
        const { payload } = event.arguments
        const {
            location,
            distance,
            matchAllCategories,
            categoryNames
        } = payload

        const [
            corePostGetRandomEror,
            corePostGetRandomData
        ] = await corePostGetRandom(
            {
                location,
                distance,
                categoryNames,
                matchAllCategories
            },
            context,
            {
                language: getLanguage(event)
            }
        )

        if (corePostGetRandomEror) throw error(corePostGetRandomEror)

        return corePostGetRandomData
    } catch (handlerError) {
        throw error(handlerError)
    } finally {
        if (context.elasticSearchClient) {
            context.elasticSearchClient.close()
        }
    }
}

export { handler }
