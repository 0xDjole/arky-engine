import {
    EUserTokenType,
    FCassandraUserTokenDelete,
    withHandleAsync
} from 'services'

const cassandraUserByTokenDelete: FCassandraUserTokenDelete = async (
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

    const [permissionsByTokenGetError] = await cassandraClient.handleExecute(
        `DELETE FROM ${tableName} WHERE ${field} = ? AND permission_id IN ?;`,
        [value, permissionIds],
        {
            prepare: true
        }
    )

    if (permissionsByTokenGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_USER_TOKEN
        })

    return true
}

export default withHandleAsync(cassandraUserByTokenDelete)
