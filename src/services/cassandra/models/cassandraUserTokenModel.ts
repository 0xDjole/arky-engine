import { types as CassandraTypes } from 'cassandra-driver'
import { CassandraUserToken, getTypeData } from 'services'

export const userTokenModel = (
    userToken: CassandraUserToken
): CassandraUserToken => userToken

export const userTokenFromItem = (
    item: CassandraTypes.Row
): CassandraUserToken => {
    const parsedItem = getTypeData(item, 'token')

    const userToken = userTokenModel({
        provider: parsedItem.provider,
        openIdToken: parsedItem.openid_token,
        accessToken: parsedItem.access_token,
        refreshToken: parsedItem.refresh_token,
        tokenType: parsedItem.token_type,
        expiresAt: parsedItem.expires_at,
        scope: parsedItem.scope
    })

    return userToken
}
