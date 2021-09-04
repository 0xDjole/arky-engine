import {
    EElasticSearchIndex,
    FElasticSearchCategoryPermissionCreate,
    withHandleAsync
} from 'services'

const elasticSearchCategoryPermissionCreate: FElasticSearchCategoryPermissionCreate = async (
    { id, permission },
    { elasticSearchClient, error, handleAsync }
): Promise<void> => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.CATEGORIES,
            id,
            body: {
                script: {
                    source: 'ctx._source.permissions.add(params.permission);',
                    lang: 'painless',
                    params: {
                        permission
                    }
                }
            }
        })
    )

    if (clientUpdateError) throw error(clientUpdateError)
}

export default withHandleAsync(elasticSearchCategoryPermissionCreate)
