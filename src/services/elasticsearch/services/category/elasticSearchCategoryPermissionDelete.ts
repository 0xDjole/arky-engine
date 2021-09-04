import {
    EElasticSearchIndex,
    FElasticSearchCategoryPermissionDelete,
    withHandleAsync
} from 'services'

const elasticSearchCategoryPermissionDelete: FElasticSearchCategoryPermissionDelete = async (
    { id, permission },
    { elasticSearchClient, error, handleAsync }
): Promise<void> => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.CATEGORIES,
            id,
            body: {
                script: {
                    source:
                        'ctx._source.permissions.removeIf(permission -> permission.id == params.permissionId);',
                    params: {
                        permissionId: permission.id
                    }
                }
            }
        })
    )

    if (clientUpdateError) throw error(clientUpdateError)
}

export default withHandleAsync(elasticSearchCategoryPermissionDelete)
