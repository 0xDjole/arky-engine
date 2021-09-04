import _ from 'lodash'
import { FCassandraUserTokenCreate, withHandleAsync } from 'services'

const cassandraUserByTokenCreate: FCassandraUserTokenCreate = async (
    { user, token },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const permissionsByAccessTokenData = user.permissions.map(permission => ({
        query: `INSERT INTO permissions_by_access_token 
            (
                token_access_token,
                token_refresh_token,
                token_openid_token,
                token_provider,
                token_type,
                token_expires_at,
                user_id,
                user_email,
                user_name,
                user_image,
                user_created_at,
                permission_category_id,
                permission_category_name,
                permission_category_image,
                permission_category_created_at,
                permission_id,
                permission_feature,
                permission_action
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) USING TTL 3500;`,
        params: [
            token.accessToken,
            token.refreshToken,
            token.openIdToken,
            token.provider,
            token.tokenType,
            token.expiresAt,
            user.id,
            user.email,
            user.name,
            user.image,
            user.createdAt,
            permission.category.id,
            permission.category.name,
            permission.category.image,
            permission.category.createdAt,
            permission.id,
            permission.feature,
            permission.action
        ]
    }))

    const permissionsByRefreshTokenData = user.permissions.map(permission => ({
        query: `INSERT INTO permissions_by_refresh_token 
                (
                    token_refresh_token,
                    token_access_token,
                    token_openid_token,
                    token_provider,
                    token_type,
                    token_expires_at,
                    user_id,
                    user_email,
                    user_name,
                    user_image,
                    user_created_at,
                    permission_category_id,
                    permission_category_name,
                    permission_category_image,
                    permission_category_created_at,
                    permission_id,
                    permission_feature,
                    permission_action
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) USING TTL 3500;`,
        params: [
            token.refreshToken,
            token.accessToken,
            token.openIdToken,
            token.provider,
            token.tokenType,
            token.expiresAt,
            user.id,
            user.email,
            user.name,
            user.image,
            user.createdAt,
            permission.category.id,
            permission.category.name,
            permission.category.image,
            permission.category.createdAt,
            permission.id,
            permission.feature,
            permission.action
        ]
    }))

    const batches = [
        ...permissionsByAccessTokenData,
        ...permissionsByRefreshTokenData
    ]

    const chunks = _.chunk(batches, 5)

    await Promise.all(
        chunks.map(async miniBatch => {
            const [batchError] = await cassandraClient.handleBatch(miniBatch, {
                prepare: true,
                logged: false
            })

            if (batchError)
                throw error({
                    message:
                        errorMessages[language].FAILED_TO_CREATE_USER_TOKENS
                })
        })
    )

    return {
        ...user,
        token
    }
}

export default withHandleAsync(cassandraUserByTokenCreate)
