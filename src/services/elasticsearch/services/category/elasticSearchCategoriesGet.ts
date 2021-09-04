import {
    EElasticSearchIndex,
    FElasticSearchCategoriesGet,
    IElasticSearchCategory,
    SearchResponse,
    withHandleAsync
} from 'services'

const elasticSearchCategoriesGet: FElasticSearchCategoriesGet = async (
    __,
    { elasticSearchClient, error, errorMessages, handleAsync },
    { language }
) => {
    const [filteredCategoriesError, filteredCategoriesData] = await handleAsync(
        elasticSearchClient.search<SearchResponse<IElasticSearchCategory>>({
            index: EElasticSearchIndex.CATEGORIES,
            body: {
                size: 20,
                query: {
                    bool: {
                        must: {
                            match_all: {}
                        }
                    }
                }
            }
        })
    )

    if (filteredCategoriesError) throw error(filteredCategoriesError)

    if (
        !filteredCategoriesData.body.hits.hits ||
        !filteredCategoriesData.body.hits.hits.length
    ) {
        throw error({
            message: errorMessages[language].NO_CATEGORIES_FOUND
        })
    }

    return filteredCategoriesData.body.hits.hits.map(hitItem => hitItem._source)
}

export default withHandleAsync(elasticSearchCategoriesGet)
