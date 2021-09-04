import {
    EElasticSearchIndex,
    FElasticSearchPostGetRandom,
    GetRandomPostSearchBody,
    IElasticSearchPost,
    SearchResponse,
    withHandleAsync
} from 'services'

const elasticSearchPostGetRandom: FElasticSearchPostGetRandom = async (
    {
        location: { lon = 0, lat = 0 },
        distance = 1000,
        categoryNames = [],
        matchAllCategories = false
    },
    { elasticSearchClient, error, errorMessages, handleAsync },
    { language }
) => {
    const query: GetRandomPostSearchBody = {
        bool: {
            must: {
                match_all: {}
            },
            filter: [
                {
                    geo_distance: {
                        distance: `${distance}m`,
                        location: {
                            lat: lat.toString(),
                            lon: lon.toString()
                        }
                    }
                }
            ]
        }
    }

    if (categoryNames && categoryNames.length) {
        query.bool.filter.push({
            terms_set: {
                'categories.name': {
                    terms: categoryNames.map(cat => cat.toLowerCase()),
                    minimum_should_match_script: {
                        source: matchAllCategories
                            ? categoryNames.length.toString()
                            : '1'
                    }
                }
            }
        })
    }

    const [randomPostError, randomPostData] = await handleAsync(
        elasticSearchClient.search<SearchResponse<IElasticSearchPost>>({
            index: EElasticSearchIndex.POSTS,
            body: {
                size: 1,
                query: {
                    function_score: {
                        query,
                        random_score: {
                            seed: (
                                Math.random() *
                                1000000000 *
                                (Math.random() * 10)
                            ).toString()
                        }
                    }
                }
            }
        })
    )

    if (randomPostError) throw error(randomPostError)

    if (
        !randomPostData.body.hits.hits ||
        !randomPostData.body.hits.hits.length
    ) {
        throw error({
            name: 'Error',
            message: errorMessages[language].NO_LOCATION_FOUND
        })
    }

    return randomPostData.body.hits.hits[0]._source
}

export default withHandleAsync(elasticSearchPostGetRandom)
