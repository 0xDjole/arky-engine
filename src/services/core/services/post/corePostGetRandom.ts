import {
    elasticSearchPostGetRandom,
    elasticSearchToPost,
    FCorePostGetRandom,
    withHandleAsync
} from 'services'

const corePostGetRandom: FCorePostGetRandom = async (
    {
        location,
        distance = 1000,
        categoryNames = [],
        matchAllCategories = false
    },
    { elasticSearchClient, error, errorMessages, handleAsync, logger },
    context
) => {
    const [
        elasticSearchPostGetRandomError,
        elasticSearchPostGetRandomData
    ] = await elasticSearchPostGetRandom(
        {
            location: {
                lat: location.latitude,
                lon: location.longitude
            },
            distance,
            categoryNames,
            matchAllCategories
        },
        { elasticSearchClient, error, errorMessages, handleAsync },
        context
    )

    if (elasticSearchPostGetRandomError)
        throw error(elasticSearchPostGetRandomError)

    logger.info(elasticSearchPostGetRandomData)
    return elasticSearchToPost(elasticSearchPostGetRandomData)
}

export default withHandleAsync(corePostGetRandom)
