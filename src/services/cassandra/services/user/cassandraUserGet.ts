import { FCassandraUserGet, userFromItem, withHandleAsync } from 'services'

const cassandraUserGet: FCassandraUserGet = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        permissionMinutesByUserError,
        permissionMinutesByUserData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permission_minutes_by_user WHERE user_id = ? LIMIT 1`,
        [id],
        {
            prepare: true
        }
    )

    if (
        permissionMinutesByUserError ||
        !permissionMinutesByUserData.rows ||
        !permissionMinutesByUserData.rows.length
    )
        throw error({
            message: errorMessages[language].USER_DOES_NOT_EXIST
        })

    const permissionMinutesByUser = permissionMinutesByUserData.rows[0]

    const [
        cassandraUserGetError,
        permissionsByUser
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM permissions_by_user WHERE user_id = ? AND minute_id = ? LIMIT 1`,
        [id, permissionMinutesByUser.get('minute_id')],
        {
            prepare: true
        }
    )

    if (
        cassandraUserGetError ||
        !permissionsByUser.rows ||
        !permissionsByUser.rows.length
    )
        throw error({
            message: errorMessages[language].USER_DOES_NOT_EXIST
        })

    const user = userFromItem(permissionsByUser.rows[0])

    return user
}

export default withHandleAsync(cassandraUserGet)
