import {
    FCassandraUsersByPermissionGet,
    userFromItem,
    withHandleAsync
} from 'services'

const cassandraUsersByPermissionGet: FCassandraUsersByPermissionGet = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        userMinutesByPermissionError,
        userMinutesByPermissionData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM user_minutes_by_permission WHERE permission_id = ?;`,
        [id],
        {
            prepare: true
        }
    )

    if (
        userMinutesByPermissionError ||
        !userMinutesByPermissionData.rows ||
        !userMinutesByPermissionData.rows.length
    )
        throw error({
            message: errorMessages[language].USER_DOES_NOT_EXIST
        })

    const [
        cassandraUsersByPermissionGetError,
        cassandraUsersByPermissionGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM users_by_permission WHERE permission_id = ? AND minute_id IN ?;`,
        [id, userMinutesByPermissionData.rows.map(row => row.minute_id)],
        {
            prepare: true
        }
    )

    if (
        cassandraUsersByPermissionGetError ||
        !cassandraUsersByPermissionGetData.rows ||
        !cassandraUsersByPermissionGetData.rows.length
    )
        throw error({
            message: errorMessages[language].USER_DOES_NOT_EXIST
        })

    return cassandraUsersByPermissionGetData.rows.map(row => userFromItem(row))
}

export default withHandleAsync(cassandraUsersByPermissionGet)
