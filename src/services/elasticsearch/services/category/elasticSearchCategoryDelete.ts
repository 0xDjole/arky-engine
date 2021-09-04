import {
    EElasticSearchIndex,
    FElasticSearchCategoryDelete,
    withHandleAsync
} from 'services'

const elasticSearchCategoryDelete: FElasticSearchCategoryDelete = async (
    { id },
    { elasticSearchClient, error, handleAsync }
) => {
    const [clientDeleteError] = await handleAsync(
        elasticSearchClient.delete({
            index: EElasticSearchIndex.CATEGORIES,
            id
        })
    )

    if (clientDeleteError) throw error(clientDeleteError)
}

export default withHandleAsync(elasticSearchCategoryDelete)
