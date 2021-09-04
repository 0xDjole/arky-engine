import {
    FCassandraPermissionsByUserGet,
    permissionFromItem,
    userFromItem,
    withHandleAsync
} from 'services'

const cassandraPermissionsByUserGet: FCassandraPermissionsByUserGet = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        permissionMinutesByUserError,
        permissionMinutesByUserData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permission_minutes_by_user WHERE user_id = ?;`,
        [id],
        { prepare: true }
    )

    if (permissionMinutesByUserError || !permissionMinutesByUserData.rowLength)
        throw error({
            message: errorMessages[language].FAILED_TO_GET_USER
        })

    const [
        permissionsByUserGetError,
        permissionsByUserGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permissions_by_user WHERE user_id = ? AND minute_id IN ?;`,
        [
            id,
            permissionMinutesByUserData.rows.map(
                permissionMinute => permissionMinute.minute_id
            )
        ],
        {
            prepare: true
        }
    )

    if (permissionsByUserGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_GET_USER
        })

    return {
        ...userFromItem(permissionsByUserGetData.rows[0]),
        permissions: permissionsByUserGetData.rows.map(row =>
            permissionFromItem(row)
        )
    }
}

export default withHandleAsync(cassandraPermissionsByUserGet)
