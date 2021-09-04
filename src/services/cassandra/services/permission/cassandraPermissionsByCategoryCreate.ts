import {
    CassandraPermission,
    FCassandraPermissionsByCategoryCreate,
    toPermissionId,
    withHandleAsync
} from 'services'

const cassandraPermissionsByCategoryCreate: FCassandraPermissionsByCategoryCreate = async (
    category,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const features = ['POST', 'CATEGORY']
    const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE']

    const permissions: CassandraPermission[] = [].concat(
        ...features.map(feature =>
            actions.map(
                (action): CassandraPermission => ({
                    id: toPermissionId({
                        action,
                        feature,
                        categoryName: category.name
                    }),
                    categoryName: category.name,
                    action,
                    feature,
                    category
                })
            )
        )
    )

    const addPermissionsToCategoryData = permissions.map(permissionItem => ({
        query: `INSERT INTO permissions_by_category 
        (
            category_id,
            category_name,
            category_image,
            category_created_at,
            category_permission_id,
            category_permission_feature,
            category_permission_action
        ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        params: [
            permissionItem.category.id,
            permissionItem.category.name,
            permissionItem.category.image,
            permissionItem.category.createdAt,
            permissionItem.id,
            permissionItem.feature,
            permissionItem.action
        ]
    }))

    const [addPermissionsToCategoryError] = await cassandraClient.handleBatch(
        addPermissionsToCategoryData,
        {
            prepare: true,
            logged: false
        }
    )

    if (addPermissionsToCategoryError)
        throw error({
            message:
                errorMessages[language].FAILED_TO_CREATE_CATEGORY_PERMISSIONS
        })

    return { ...category, permissions }
}

export default withHandleAsync(cassandraPermissionsByCategoryCreate)
