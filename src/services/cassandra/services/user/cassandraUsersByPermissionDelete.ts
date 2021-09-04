import {
    cassandraUsersByPermissionGet,
    FCassandraUsersByPermissionGet
} from 'services'

const cassandraUsersByPermissionDelete: FCassandraUsersByPermissionGet = async (
    permission,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraUsersByPermissionGetError,
        cassandraUsersByPermissionGetData
    ] = await cassandraUsersByPermissionGet(
        permission,
        { cassandraClient, error, errorMessages },
        { language }
    )

    if (cassandraUsersByPermissionGetError)
        throw error(cassandraUsersByPermissionGetError)

    const [
        permissionUserLookupGetError,
        permissionUserLookupGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permission_user_lookup WHERE user_id IN ? AND permission_id = ?;`,
        [
            cassandraUsersByPermissionGetData.map(userItem => userItem.id),
            permission.id
        ],
        { prepare: true }
    )

    if (permissionUserLookupGetError)
        throw error({
            name: 'Error',
            message: errorMessages[language].FAILED_TO_DELETE_USER_PERMISSIONS
        })

    const [
        userMinutesByPermissionError,
        userMinutesByPermissionData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM user_minutes_by_permission WHERE permission_id = ?;`,
        [permission.id],
        {
            prepare: true
        }
    )

    if (userMinutesByPermissionError) throw error(userMinutesByPermissionError)

    const deletePermissionsByUserData = {
        query: `DELETE FROM permissions_by_user WHERE user_id IN ? AND minute_id IN ?;`,
        params: [
            cassandraUsersByPermissionGetData.map(userItem => userItem.id),
            permissionUserLookupGetData.rows.map(rowItem => rowItem.minute_id)
        ]
    }

    const deletePermissionsByUserLookupData = {
        query: `DELETE FROM permission_user_lookup WHERE user_id IN ? AND permission_id = ?;`,
        params: [
            cassandraUsersByPermissionGetData.map(userItem => userItem.id),
            permission.id
        ]
    }

    const deletePermissionMinutesByUserData = {
        query: `DELETE FROM permission_minutes_by_user WHERE user_id IN ? AND minute_id IN ?;`,
        params: [
            permissionUserLookupGetData.rows.map(rowItem => rowItem.user_id),
            userMinutesByPermissionData.rows.map(rowItem => rowItem.minute_id)
        ]
    }

    const deleteUsersByPermissionData = {
        query: `DELETE FROM users_by_permission WHERE permission_id = ? AND minute_id IN ?;`,
        params: [
            permission.id,
            userMinutesByPermissionData.rows.map(rowItem => rowItem.minute_id)
        ]
    }

    const deleteUsersMinutesByPermissionData = {
        query: `DELETE FROM user_minutes_by_permission WHERE permission_id = ?;`,
        params: [permission.id]
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
            name: 'Error',
            message: errorMessages[language].FAILED_TO_DELETE_USER_PERMISSIONS
        })

    return cassandraUsersByPermissionGetData
}

export default cassandraUsersByPermissionDelete
