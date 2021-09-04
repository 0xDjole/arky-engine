import { types as cassandraTypes } from 'cassandra-driver'
import moment from 'moment'
import { FCassandraPostsByCategoryDelete, withHandleAsync } from 'services'

const cassandraPostsByCategoryDelete: FCassandraPostsByCategoryDelete = async (
    { posts, category },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    if (!posts || !posts.length) return true

    const timeUUID = cassandraTypes.TimeUuid.fromDate(
        moment().toDate()
    ).toString()

    const [
        cassandraPostsByCategoryMinutesError,
        cassandraPostsByCategoryMinutesData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM posts_by_category_minutes
            WHERE category_id = ?
            AND minute_id < ?;`,
        [category.id, timeUUID],
        {
            prepare: true
        }
    )

    if (cassandraPostsByCategoryMinutesError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_CATEGORIES
        })

    const [
        cassandraPostsByCategoryDeleteError
    ] = await cassandraClient.handleExecute(
        `DELETE FROM posts_by_category
            WHERE category_id = ?
            AND minute_id IN ?;`,
        [
            category.id,
            cassandraPostsByCategoryMinutesData.rows.map(data => data.minute_id)
        ],
        {
            prepare: true
        }
    )

    if (cassandraPostsByCategoryDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_CATEGORIES
        })

    return true
}

export default withHandleAsync(cassandraPostsByCategoryDelete)
