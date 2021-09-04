import {
    EElasticSearchIndex,
    FElasticSearchPostCategoryCreate,
    withHandleAsync
} from 'services'

const elasticSearchPostCategoryCreate: FElasticSearchPostCategoryCreate = async (
    { id, category },
    { elasticSearchClient, error, handleAsync }
): Promise<void> => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.POSTS,
            id,
            body: {
                script: {
                    source: 'ctx._source.categories.add(params.category);',
                    lang: 'painless',
                    params: {
                        category
                    }
                }
            }
        })
    )

    if (clientUpdateError) throw error(clientUpdateError)
}

export default withHandleAsync(elasticSearchPostCategoryCreate)
