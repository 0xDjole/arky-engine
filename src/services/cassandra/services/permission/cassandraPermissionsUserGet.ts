import {
    FCassandraPermissionsUserGet,
    getTypeData,
    permissionFromItem,
    userFromItem,
    withHandleAsync
} from 'services'

const cassandraPermissionsUserGet: FCassandraPermissionsUserGet = async (
    { user, permissions },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        permissionsUserGetError,
        permissionsUserGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permission_user_lookup WHERE user_id = ? AND permission_id IN ?;`,
        [user.id, permissions.map(permissionItem => permissionItem.id)],
        {
            prepare: true
        }
    )

    if (permissionsUserGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_GET_USER_PERMISSION
        })

    return {
        user: permissionsUserGetData.rowLength
            ? userFromItem(getTypeData(permissionsUserGetData.rows[0], 'user'))
            : null,
        permissions: permissionsUserGetData.rows.map(row =>
            permissionFromItem(getTypeData(row, 'permission'))
        )
    }
}

export default withHandleAsync(cassandraPermissionsUserGet)
