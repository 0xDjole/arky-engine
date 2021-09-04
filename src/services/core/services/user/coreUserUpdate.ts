import { cassandraUserUpdate, FCoreUserUpdate, withHandleAsync } from 'services'

const coreUserUpdate: FCoreUserUpdate = async (
    params,
    { cassandraClient, error, errorMessages, handleAsync, logger },
    context
) => {
    const [updateUserError, updateUserData] = await cassandraUserUpdate(
        params,
        { cassandraClient, error, errorMessages, handleAsync },
        context
    )

    if (updateUserError)
        throw error({
            name: updateUserError.name,
            message: updateUserError.message,
            logger
        })

    logger.info(updateUserData)
    return updateUserData
}

export default withHandleAsync(coreUserUpdate)
