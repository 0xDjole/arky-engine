import {
    EElasticSearchIndex,
    FElasticSearchUserPermissionCreate,
    withHandleAsync
} from 'services'

const elasticSearchUserPermissionCreate: FElasticSearchUserPermissionCreate = async (
    { id, permissions },
    { elasticSearchClient, error, handleAsync }
): Promise<void> => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.USERS,
            id,
            body: {
                script: {
                    source: `
                        for (permissionItem in params.permissions) {
                            if (ctx._source.permissions!=null && !ctx._source.permissions.stream().anyMatch(permission-> permission.id.equals(permissionItem.id))) {
                                ctx._source.permissions.add(permissionItem)
                            }
                        }
                        `,
                    params: {
                        permissions
                    }
                }
            }
        })
    )

    if (clientUpdateError) throw error(clientUpdateError)
}

export default withHandleAsync(elasticSearchUserPermissionCreate)
