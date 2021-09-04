import jwt from 'jsonwebtoken'
import moment from 'moment'
import {
    cassandraPermissionsByUserGet,
    cassandraUserByTokenCreate,
    cassandraUserCreate,
    EKafkaAction,
    EKafkaTopic,
    FCoreUserOAuth2Login,
    googleOAuth2Login,
    ICoreOAuth2IdTokenParsed,
    kafkaMessageProduce,
    permissionToDoc,
    toUserId,
    userToDoc,
    withHandleAsync
} from 'services'

const coreUserOAuth2Login: FCoreUserOAuth2Login = async (
    { code, originURI, provider },
    {
        cassandraClient,
        error,
        errorMessages,
        handleAsync,
        logger,
        kafkaProducer
    },
    { language }
) => {
    const [googleOAuth2LoginError, googleOAuth2LoginData] = await handleAsync(
        googleOAuth2Login(
            {
                code,
                originURI,
                provider
            },
            { error, errorMessages, handleAsync },
            { language }
        )
    )

    if (googleOAuth2LoginError)
        throw error({
            message: errorMessages[language].FAILED_TO_LOGIN
        })

    const { email, name, picture }: ICoreOAuth2IdTokenParsed = jwt.decode(
        googleOAuth2LoginData.openIdToken
    ) as ICoreOAuth2IdTokenParsed

    const [
        cassandraUserGetError,
        cassandraUserData
    ] = await cassandraPermissionsByUserGet(
        {
            id: toUserId({
                email
            })
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language: 'en-US' }
    )

    if (cassandraUserGetError || !cassandraUserData)
        await cassandraUserCreate(
            {
                email,
                name,
                image: picture
            },
            { cassandraClient, error, errorMessages, handleAsync },
            { language: 'en-US' }
        )

    const tokenData = {
        provider: 'GOOGLE',
        openIdToken: googleOAuth2LoginData.openIdToken,
        accessToken: googleOAuth2LoginData.accessToken,
        refreshToken: googleOAuth2LoginData.refreshToken,
        tokenType: googleOAuth2LoginData.tokenType,
        expiresAt: moment()
            .add(googleOAuth2LoginData.expiresIn, 'seconds')
            .toDate(),
        scope: googleOAuth2LoginData.scope
    }

    const [
        cassandraUserByTokenCreateError,
        cassandraUserByTokenCreateData
    ] = await cassandraUserByTokenCreate(
        {
            user: cassandraUserData,
            token: tokenData
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraUserByTokenCreateError)
        throw error(cassandraUserByTokenCreateError)

    if (kafkaProducer) {
        const [kafkaProducerError] = await kafkaMessageProduce(
            kafkaProducer,
            userToDoc(cassandraUserByTokenCreateData, {
                permissions: cassandraUserByTokenCreateData.permissions.map(
                    permission => permissionToDoc(permission)
                )
            }),
            EKafkaTopic.USERS,
            EKafkaAction.CREATE
        )

        if (kafkaProducerError)
            throw error({
                name: kafkaProducerError.name,
                message: kafkaProducerError.message,
                logger
            })
    }

    return cassandraUserByTokenCreateData
}

export default withHandleAsync(coreUserOAuth2Login)
