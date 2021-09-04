import {
    EElasticSearchIndex,
    FElasticSearchUserPermissionDelete,
    withHandleAsync
} from 'services'

const elasticSearchUserPermissionDelete: FElasticSearchUserPermissionDelete = async (
    { id, permission },
    { elasticSearchClient, error, handleAsync }
): Promise<void> => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.USERS,
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

export default withHandleAsync(elasticSearchUserPermissionDelete)
