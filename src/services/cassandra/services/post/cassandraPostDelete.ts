import {
    cassandraCategoriesByPostDelete,
    cassandraCategoriesByPostGet,
    cassandraPostsByFeedDelete,
    FCassandraPostDelete,
    withHandleAsync
} from 'services'

const cassandraPostDelete: FCassandraPostDelete = async (
    { id },
    { cassandraClient, error, errorMessages, handleAsync },
    { language }
) => {
    const [
        cassandraCategoriesByPostError,
        cassandraCategoriesByPostData
    ] = await cassandraCategoriesByPostGet(
        {
            id
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraCategoriesByPostError)
        throw error(cassandraCategoriesByPostError)

    const [
        cassandraCategoriesByPostDeleteError
    ] = await cassandraCategoriesByPostDelete(
        {
            post: cassandraCategoriesByPostData,
            categories: cassandraCategoriesByPostData.categories
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraCategoriesByPostDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_CATEGORIES
        })

    const [cassandraPostsByFeedDeleteError] = await cassandraPostsByFeedDelete(
        { post: cassandraCategoriesByPostData },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPostsByFeedDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_FEED
        })

    return cassandraCategoriesByPostData
}

export default withHandleAsync(cassandraPostDelete)
