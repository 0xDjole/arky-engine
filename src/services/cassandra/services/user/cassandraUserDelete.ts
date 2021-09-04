import {
    cassandraTimeUuid,
    cassandraUserGet,
    FCassandraUserDelete,
    withHandleAsync
} from 'services'

const cassandraUserDelete: FCassandraUserDelete = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraUserGetError,
        cassandraUserGetData
    ] = await cassandraUserGet(
        {
            id
        },
        { cassandraClient, error, errorMessages },
        { language }
    )

    if (cassandraUserGetError) throw error(cassandraUserGetError)

    const startOfMinuteUuid = cassandraTimeUuid('minute')

    const [cassandraUserDeleteError] = await cassandraClient.handleExecute(
        `DELETE FROM permissions_by_user WHERE user_id = ? AND minute_id < ?`,
        [id, startOfMinuteUuid],
        {
            prepare: true
        }
    )

    if (cassandraUserDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_CATEGORY
        })

    return cassandraUserGetData
}

export default withHandleAsync(cassandraUserDelete)
