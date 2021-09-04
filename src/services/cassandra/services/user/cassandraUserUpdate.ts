import {
    cassandraUserGet,
    FCassandraUserUpdate,
    withHandleAsync
} from 'services'

const cassandraUserUpdate: FCassandraUserUpdate = async (
    { userKeyData, updateUserData },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraUserGetError,
        cassandraUserGetData
    ] = await cassandraUserGet(
        userKeyData,
        { cassandraClient, error, errorMessages },
        { language }
    )

    if (cassandraUserGetError) throw error(cassandraUserGetError)

    const [cassandraUserUpdateError] = await cassandraClient.handleExecute(
        `UPDATE users SET image = ?, name = ? WHERE id = ?;`,
        [updateUserData.image, updateUserData.name, userKeyData.id],
        {
            prepare: true
        }
    )

    if (cassandraUserUpdateError)
        throw error({
            message: errorMessages[language].FAILED_TO_UPDATE_USER
        })

    return {
        id: cassandraUserGetData.id,
        email: cassandraUserGetData.email,
        name: updateUserData.name,
        image: updateUserData.image,
        createdAt: cassandraUserGetData.createdAt
    }
}

export default withHandleAsync(cassandraUserUpdate)
