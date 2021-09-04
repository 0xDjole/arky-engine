import { types as cassandraTypes } from 'cassandra-driver'
import moment from 'moment'
import {
    categoryFromItem,
    FCassandraPostsByCategoryGet,
    getTypeData,
    postFromItem,
    withHandleAsync
} from 'services'

const cassandraPostsByCategoryGet: FCassandraPostsByCategoryGet = async (
    { id },
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const timeUUID = cassandraTypes.TimeUuid.fromDate(
        moment().toDate()
    ).toString()

    const [
        cassandraPostsByCategoryMinutesGetError,
        cassandraPostsByCategoryMinutesGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM post_minutes_by_category 
            WHERE category_id = ?
            AND minute_id < ?;`,
        [id, timeUUID],
        {
            prepare: true
        }
    )

    if (cassandraPostsByCategoryMinutesGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_GET_POST_CATEGORIES
        })

    if (
        !cassandraPostsByCategoryMinutesGetData ||
        !cassandraPostsByCategoryMinutesGetData.rowLength
    ) {
        return {
            posts: [],
            category: null
        }
    }

    const [
        cassandraPostsByCategoryGetError,
        cassandraPostsByCategoryGetData
    ] = await cassandraClient.handleExecute(
        `SELECT * FROM posts_by_category 
            WHERE category_id = ? 
            AND minute_id IN ?;`,
        [
            id,
            cassandraPostsByCategoryMinutesGetData.rows.map(
                date => date.minute_id
            )
        ],
        {
            prepare: true
        }
    )

    if (cassandraPostsByCategoryGetError)
        throw error({
            message: errorMessages[language].FAILED_TO_GET_POST_CATEGORIES
        })

    return {
        posts: cassandraPostsByCategoryGetData.rows.map(row =>
            postFromItem(row)
        ),
        category: categoryFromItem(
            getTypeData(cassandraPostsByCategoryGetData.rows[0], 'category')
        )
    }
}

export default withHandleAsync(cassandraPostsByCategoryGet)
