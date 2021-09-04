import jwt from 'jsonwebtoken'
import { curry } from 'lodash'
import moment from 'moment'
import {
    cassandraPermissionsByUserGet,
    cassandraUserByTokenCreate,
    FCoreUserOAuth2RefreshAccessToken,
    googleOAuth2RefreshAccessToken,
    ICoreOAuth2IdTokenParsed,
    toUserId
} from 'services'

import { withHandleAsync } from '../../../utils'

const coreUserOAuth2RefreshAccessToken: FCoreUserOAuth2RefreshAccessToken = async (
    { refreshToken, originURI, provider },
    { cassandraClient, error, errorMessages, handleAsync },
    { language }
) => {
    const [
        googleOAuth2RefreshAccessTokenError,
        googleOAuth2RefreshAccessTokenData
    ] = await googleOAuth2RefreshAccessToken(
        {
            refreshToken,
            originURI,
            provider
        },
        { error, errorMessages, handleAsync },
        { language }
    )

    if (googleOAuth2RefreshAccessTokenError)
        throw error(googleOAuth2RefreshAccessTokenError)

    const { email }: ICoreOAuth2IdTokenParsed = jwt.decode(
        googleOAuth2RefreshAccessTokenData.openIdToken
    ) as ICoreOAuth2IdTokenParsed

    const [
        cassandraPermissionsByUserGetError,
        cassandraPermissionsByUserGetData
    ] = await cassandraPermissionsByUserGet(
        {
            id: toUserId({
                email
            })
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language: 'en-US' }
    )

    if (cassandraPermissionsByUserGetError)
        throw error(cassandraPermissionsByUserGetError)

    const tokenData = {
        provider: 'GOOGLE',
        openIdToken: googleOAuth2RefreshAccessTokenData.openIdToken,
        accessToken: googleOAuth2RefreshAccessTokenData.accessToken,
        refreshToken: googleOAuth2RefreshAccessTokenData.refreshToken,
        tokenType: googleOAuth2RefreshAccessTokenData.tokenType,
        expiresAt: moment()
            .add(googleOAuth2RefreshAccessTokenData.expiresIn, 'seconds')
            .toDate(),
        scope: googleOAuth2RefreshAccessTokenData.scope
    }

    const [
        cassandraUserByTokenCreateError,
        cassandraUserByTokenCreateData
    ] = await cassandraUserByTokenCreate(
        {
            user: cassandraPermissionsByUserGetData,
            token: tokenData
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraUserByTokenCreateError)
        throw error(cassandraUserByTokenCreateError)

    return cassandraUserByTokenCreateData
}

export default withHandleAsync(coreUserOAuth2RefreshAccessToken)
