import {
    EElasticSearchIndex,
    FElasticSearchPostCategoryDelete,
    withHandleAsync
} from 'services'

const elasticSearchPostCategoryDelete: FElasticSearchPostCategoryDelete = async (
    { id, categoryName },
    { elasticSearchClient, error, handleAsync }
): Promise<void> => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.POSTS,
            id,
            body: {
                script: {
                    source:
                        'ctx._source.categories.removeIf(category -> category.name == params.categoryName);',
                    params: {
                        categoryName
                    }
                }
            }
        })
    )

    if (clientUpdateError) throw error(clientUpdateError)
}

export default withHandleAsync(elasticSearchPostCategoryDelete)
