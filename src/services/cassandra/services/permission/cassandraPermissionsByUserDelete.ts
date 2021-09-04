import { FCassandraPermissionsByUserDelete, withHandleAsync } from 'services'

const cassandraPermissionsByUserDelete: FCassandraPermissionsByUserDelete = async (
    { user, permissions },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraUserPermissionLookUpGetError,
        cassandraUserPermissionLookUpGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permission_user_lookup
            WHERE user_id = ? 
            AND permission_id IN ?;`,
        [user.id, permissions.map(permissionItem => permissionItem.id)],
        {
            prepare: true
        }
    )

    if (cassandraUserPermissionLookUpGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_USER_PERMISSIONS
        })

    const deletePermissionMinutesByUserData = {
        query: `DELETE FROM permission_minutes_by_user WHERE user_id = ?;`,
        params: [user.id]
    }

    const deletePermissionsByUserLookupData = {
        query: `DELETE FROM permissions_by_user_lookup WHERE user_id = ? AND permission_id IN ?;`,
        params: [user.id, permissions.map(permissionItem => permissionItem.id)]
    }

    const deletePermissionsByUserData = {
        query: `DELETE FROM permissions_by_user WHERE user_id = ? AND minute_id IN ?;`,
        params: [
            user.id,
            cassandraUserPermissionLookUpGetData.rows.map(
                rowItem => rowItem.minute_id
            )
        ]
    }

    const deleteUsersByPermissionData = {
        query: `DELETE FROM users_by_permission WHERE permission_id IN ? AND minute_id IN ?;`,
        params: [
            permissions.map(permissionItem => permissionItem.id),
            cassandraUserPermissionLookUpGetData.rows.map(
                rowItem => rowItem.minute_id
            )
        ]
    }

    const deleteUsersMinutesByPermissionData = {
        query: `DELETE FROM user_minutes_by_permission WHERE permission_id IN ?;`,
        params: [permissions.map(permissionItem => permissionItem.id)]
    }

    const [
        cassandraPermissionsByUserDeleteError
    ] = await cassandraClient.handleBatch(
        [
            deletePermissionsByUserData,
            deletePermissionsByUserLookupData,
            deletePermissionMinutesByUserData,
            deleteUsersByPermissionData,
            deleteUsersMinutesByPermissionData
        ],
        {
            prepare: true
        }
    )

    if (cassandraPermissionsByUserDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_USER_PERMISSIONS
        })

    return {
        user,
        permissions
    }
}

export default withHandleAsync(cassandraPermissionsByUserDelete)
