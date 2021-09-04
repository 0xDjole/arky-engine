import {
    EUserTokenType,
    FCassandraUserTokenGet,
    permissionFromItem,
    userFromItem,
    userTokenFromItem,
    withHandleAsync
} from 'services'

const cassandraUserByTokenGet: FCassandraUserTokenGet = async (
    { type, value, permissionIds },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const tableName =
        type === EUserTokenType.ACCESS_TOKEN
            ? 'permissions_by_access_token'
            : 'permissions_by_refresh_token'

    const field =
        type === EUserTokenType.ACCESS_TOKEN
            ? 'token_access_token'
            : 'token_refresh_token'

    const [
        permissionsByTokenGetError,
        permissionsByTokenGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM ${tableName} WHERE ${field} = ? AND permission_id IN ?;`,
        [value, permissionIds],
        {
            prepare: true
        }
    )

    if (permissionsByTokenGetError || !permissionsByTokenGetData.rowLength)
        throw error({
            message: errorMessages[language].FAILED_TO_GET_USER_TOKEN
        })

    return {
        ...userFromItem(permissionsByTokenGetData.rows[0]),
        token: userTokenFromItem(permissionsByTokenGetData.rows[0]),
        permissions: permissionsByTokenGetData.rows.map(permissionItem =>
            permissionFromItem(permissionItem)
        )
    }
}

export default withHandleAsync(cassandraUserByTokenGet)
