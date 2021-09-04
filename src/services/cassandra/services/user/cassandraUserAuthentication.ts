import {
    cassandraUserByTokenGet,
    EUserTokenType,
    FCassandraUserAuthentication
} from 'services'

const cassandraUserAuthentication: FCassandraUserAuthentication = callback => async (
    params,
    contextReused,
    context
) => {
    const [
        coreUserByTokenError,
        coreUserByTokenData
    ] = !context.skipPermissionCheck
        ? await cassandraUserByTokenGet(
              {
                  permissionIds: ['PERMISSION#public#post#read'],
                  type: EUserTokenType.ACCESS_TOKEN,
                  value: context.headers.authorization
              },
              contextReused,
              context
          )
        : [null, null]

    if (coreUserByTokenError || !coreUserByTokenData)
        throw contextReused.error({
            message:
                contextReused.errorMessages[context.language]
                    .USER_NOT_AUTHENTICATED
        })

    const [callbackError, callbackData] = await contextReused.handleAsync(
        callback(params, contextReused, {
            ...context,
            user: coreUserByTokenData
        })
    )

    if (callbackError) throw contextReused.error(callbackError)

    return callbackData
}

export default cassandraUserAuthentication
