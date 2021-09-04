import { FCassandraPostGet, postFromItem, withHandleAsync } from 'services'

const cassandraPostGet: FCassandraPostGet = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [
        cassandraPostGetError,
        cassandraPostGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM categories_by_post WHERE post_id = ?;`,
        [id],
        {
            prepare: true
        }
    )

    if (
        cassandraPostGetError ||
        !cassandraPostGetData ||
        !cassandraPostGetData.rows ||
        !cassandraPostGetData.rows[0]
    )
        throw error({
            message: errorMessages[language].POST_DOES_NOT_EXIST
        })

    return {
        ...postFromItem(cassandraPostGetData.rows[0])
    }
}

export default withHandleAsync(cassandraPostGet)
