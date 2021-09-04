import {
    cassandraPermissionsByUserGet,
    cassandraUserAuthentication,
    cassandraUserByTokenDelete,
    EUserTokenType,
    FCoreUserOAuth2Logout,
    googleOAuth2Logout,
    withHandleAsync
} from 'services'

const coreUserOAuth2Logout: FCoreUserOAuth2Logout = async (
    { token, originURI, provider },
    { cassandraClient, error, errorMessages, handleAsync },
    { language, user }
) => {
    const [
        cassandraPermissionsUserGetError,
        cassandraPermissionsUserGetData
    ] = await cassandraPermissionsByUserGet(
        {
            id: user.id
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPermissionsUserGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_LOGOUT
        })

    const [cassandraUserByTokenDeleteError] = await cassandraUserByTokenDelete(
        {
            type: EUserTokenType.ACCESS_TOKEN,
            value: token,
            permissionIds: cassandraPermissionsUserGetData.permissions.map(
                permissionItem => permissionItem.id
            )
        },
        { error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraUserByTokenDeleteError)
        throw error(cassandraUserByTokenDeleteError)

    const [googleOAuth2LogoutError] = await handleAsync(
        googleOAuth2Logout(
            {
                token,
                originURI,
                provider
            },
            { error, errorMessages, handleAsync },
            { language }
        )
    )

    if (googleOAuth2LogoutError) throw error(googleOAuth2LogoutError)

    return true
}

export default withHandleAsync(
    cassandraUserAuthentication(coreUserOAuth2Logout)
)
