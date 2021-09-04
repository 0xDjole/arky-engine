import {
    cassandraUserByTokenGet,
    EUserTokenType,
    FCassandraUserAuthorizaton,
    toPermissionId
} from 'services'

const cassandraUserAuthorization: FCassandraUserAuthorizaton = (
    callback,
    validator
) => async (params, contextReused, context) => {
    const permissionMap = await validator(params, contextReused, context)

    if (!permissionMap) return null

    const permissionIds = permissionMap.categoryIds.map(categoryId =>
        toPermissionId({
            categoryName: categoryId.split('#')[1],
            action: permissionMap.action,
            feature: permissionMap.feature
        })
    )

    const { matchAllPermissions } = permissionMap

    const [
        cassandraUserByTokenGetError,
        cassandraUserByTokenGetData
    ] = !context.skipPermissionCheck
        ? await cassandraUserByTokenGet(
              {
                  permissionIds,
                  type: EUserTokenType.ACCESS_TOKEN,
                  value: context.headers.authorization
              },
              contextReused,
              context
          )
        : [null, null]

    if (
        cassandraUserByTokenGetError ||
        !cassandraUserByTokenGetData ||
        (cassandraUserByTokenGetData.permissions.length !==
            permissionIds.length &&
            matchAllPermissions)
    )
        throw contextReused.error({
            message:
                contextReused.errorMessages[context.language]
                    .USER_NOT_AUTHORIZED
        })

    const [callbackError, callbackData] = await contextReused.handleAsync(
        callback(params, contextReused, {
            ...context,
            user: cassandraUserByTokenGetData
        })
    )

    if (callbackError) throw contextReused.error(callbackError)

    return callbackData
}

export default cassandraUserAuthorization
