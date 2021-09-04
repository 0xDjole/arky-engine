import jwt from 'jsonwebtoken'
import {
    cassandraUserGet,
    FCoreUserGetMe,
    toUserId,
    withHandleAsync
} from 'services'

const coreUserGetMe: FCoreUserGetMe = async (
    params,
    { cassandraClient, error, errorMessages, handleAsync, logger },
    context
) => {
    const userData = jwt.decode(params) as {
        email: string
        name: string
    }

    const [getMeError, getMeData] = await cassandraUserGet(
        {
            id: toUserId({
                email: userData.email
            })
        },
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (getMeError)
        throw error({
            name: getMeError.name,
            message: getMeError.message,
            logger
        })

    logger.info(getMeData)
    return getMeData
}

export default withHandleAsync(coreUserGetMe)
