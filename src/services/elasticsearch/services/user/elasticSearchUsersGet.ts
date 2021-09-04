import {
    EElasticSearchIndex,
    FElasticSearchUsersGet,
    IElasticSearchUser,
    SearchResponse,
    withHandleAsync
} from 'services'

const elasticSearchUsersGet: FElasticSearchUsersGet = async (
    { permissionIds, matchAll },
    { elasticSearchClient, error, errorMessages, handleAsync },
    { language }
) => {
    const [filteredUsersError, filteredUsersData] = await handleAsync(
        elasticSearchClient.search<SearchResponse<IElasticSearchUser>>({
            index: EElasticSearchIndex.USERS,
            body: {
                size: 20,
                query: {
                    bool: {
                        filter: [
                            {
                                terms_set: {
                                    'permissions.id': {
                                        terms: permissionIds,
                                        minimum_should_match_script: {
                                            source: matchAll
                                                ? permissionIds.length.toString()
                                                : '1'
                                        }
                                    }
                                }
                            }
                        ],
                        must: {
                            match_all: {}
                        }
                    }
                }
            }
        })
    )

    if (filteredUsersError) throw error(filteredUsersError)

    if (
        !filteredUsersData.body.hits.hits ||
        !filteredUsersData.body.hits.hits.length
    ) {
        throw error({
            message: errorMessages[language].NO_CATEGORIES_FOUND
        })
    }

    return filteredUsersData.body.hits.hits.map(hitItem => hitItem._source)
}

export default withHandleAsync(elasticSearchUsersGet)
