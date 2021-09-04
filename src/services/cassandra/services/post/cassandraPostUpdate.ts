import {
    cassandraCategoriesByPostCreate,
    cassandraCategoriesByPostDelete,
    cassandraCategoriesByPostGet,
    FCassandraPostUpdate,
    withHandleAsync
} from 'services'

const cassandraPostUpdate: FCassandraPostUpdate = async (
    params,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    if (
        params.updatePostData.categoryIds &&
        params.updatePostData.categoryIds.length > 20
    )
        throw error({
            message: errorMessages[language].POST_CAN_HAVE_UP_TO_20_CATEGORIES
        })

    const [
        cassandraPostGetError,
        cassandraPostGetData
    ] = await cassandraCategoriesByPostGet(
        {
            id: params.postKeyData.id
        },
        { cassandraClient, error, errorMessages },
        { language }
    )

    if (cassandraPostGetError) throw error(cassandraPostGetError)

    const [cassandraPostUpdateError] = await cassandraClient.handleExecute(
        `UPDATE posts SET image = ? WHERE id = ?;`,
        [cassandraPostGetData.image, cassandraPostGetData.id],
        {
            prepare: true
        }
    )

    if (cassandraPostUpdateError)
        throw error({
            message: errorMessages[language].FAILED_TO_UPDATE_POST
        })

    const [
        cassandraCategoriesByPostDeleteError
    ] = await cassandraCategoriesByPostDelete(
        {
            post: cassandraPostGetData,
            categories: cassandraPostGetData.categories.filter(
                categoryItem =>
                    !params.updatePostData.categoryIds.includes(categoryItem.id)
            )
        },
        { cassandraClient, error, errorMessages },
        { language }
    )

    if (cassandraCategoriesByPostDeleteError)
        throw error({
            message: errorMessages[language].FAILED_TO_DELETE_POST_CATEGORIES
        })

    const [
        cassandraPostCategoriesUpsertError,
        cassandraPostCategoriesUpsertData
    ] = await cassandraCategoriesByPostCreate(
        {
            post: cassandraPostGetData,
            categories: cassandraPostGetData.categories
        },
        { cassandraClient, error, errorMessages },
        { language }
    )

    if (cassandraPostCategoriesUpsertError)
        throw error(cassandraPostCategoriesUpsertError)

    return cassandraPostCategoriesUpsertData
}

export default withHandleAsync(cassandraPostUpdate)
