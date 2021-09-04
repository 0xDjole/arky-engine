import { cassandraUserDelete, FCoreUserDelete, withHandleAsync } from 'services'

const coreUserDelete: FCoreUserDelete = async (
    params,
    { cassandraClient, error, handleAsync, logger },
    context
) => {
    const [deleteUserError, deleteUserData] = await cassandraUserDelete(
        params,
        { cassandraClient, error, handleAsync },
        context
    )

    if (deleteUserError)
        throw error({
            name: deleteUserError.name,
            message: deleteUserError.message,
            logger
        })

    logger.info(deleteUserData)
    return deleteUserData
}

export default withHandleAsync(coreUserDelete)
