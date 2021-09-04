import {
    EElasticSearchIndex,
    FElasticSearchCategoryUpsert,
    withHandleAsync
} from 'services'

const elasticSearchCategoryUpsert: FElasticSearchCategoryUpsert = async (
    { id, category },
    { elasticSearchClient, error, handleAsync }
) => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.CATEGORIES,
            id,
            body: {
                doc_as_upsert: true,
                doc: category
            }
        })
    )

    if (clientUpdateError) throw error(clientUpdateError)
}

export default withHandleAsync(elasticSearchCategoryUpsert)
