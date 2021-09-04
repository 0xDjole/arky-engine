import {
    categoryFromItem,
    FCassandraPermissionsByCategoryGet,
    permissionFromItem,
    withHandleAsync
} from 'services'

const cassandraPermissionsByCategoryGet: FCassandraPermissionsByCategoryGet = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraPermissionsByCategoryGetError,
        cassandraPermissionsByCategoryGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permissions_by_category
            WHERE category_id = ?;`,
        [id],
        {
            prepare: true
        }
    )

    if (
        cassandraPermissionsByCategoryGetError ||
        !cassandraPermissionsByCategoryGetData.rows ||
        !cassandraPermissionsByCategoryGetData.rows.length
    )
        throw error({
            message: errorMessages[language].PERMISSIONS_DOES_NOT_EXIST
        })

    return {
        ...categoryFromItem(cassandraPermissionsByCategoryGetData.rows[0]),
        permissions: cassandraPermissionsByCategoryGetData.rows.map(row =>
            permissionFromItem({
                ...row,
                permission_id: row.category_permission_id,
                permission_action: row.category_permission_action,
                permission_feature: row.category_permission_feature,
                permission_category_id: row.category_id,
                permission_category_name: row.category_name,
                permission_category_image: row.category_image,
                permission_category_created_at: row.category_created_at
            })
        )
    }
}

export default withHandleAsync(cassandraPermissionsByCategoryGet)
