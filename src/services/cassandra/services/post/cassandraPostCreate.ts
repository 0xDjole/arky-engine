import moment from 'moment'
import {
    cassandraCategoriesByPostCreate,
    cassandraCategoriesGet,
    cassandraPostGet,
    cassandraPostModel,
    cassandraPostsByFeedCreate,
    cassandraUsersByPermissionGet,
    FCassandraPostCreate,
    toPermissionId,
    toPostId,
    withHandleAsync
} from 'services'

const cassandraPostCreate: FCassandraPostCreate = async (
    params,
    { cassandraClient, error, errorMessages, handleAsync },
    { language }
) => {
    if (params.categoryIds && params.categoryIds.length > 20)
        throw error({
            message: errorMessages[language].POST_CAN_HAVE_UP_TO_20_CATEGORIES
        })

    const [, cassandraPostGetData] = await cassandraPostGet(
        {
            id: toPostId(params)
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPostGetData)
        throw error({
            message: errorMessages[language].POST_ALREADY_EXISTS
        })

    const [
        cassandraCategoriesGetError,
        cassandraCategoriesGetData
    ] = await cassandraCategoriesGet(
        params.categoryIds.map(id => ({ id })),
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraCategoriesGetError) throw error(cassandraCategoriesGetError)

    const post = cassandraPostModel(params, language)

    const [
        cassandraCategoriesByPostCreateError,
        cassandraCategoriesByPostCreateData
    ] = await cassandraCategoriesByPostCreate(
        {
            post,
            categories: cassandraCategoriesGetData
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraCategoriesByPostCreateError)
        throw error(cassandraCategoriesByPostCreateError)

    return cassandraCategoriesByPostCreateData
}

export default withHandleAsync(cassandraPostCreate)
