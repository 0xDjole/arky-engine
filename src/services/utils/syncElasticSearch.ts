/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
import {
    elasticSearchCategoryDelete,
    elasticSearchCategoryUpsert,
    elasticSearchPostDelete,
    elasticSearchPostUpsert,
    elasticSearchUserPermissionCreate,
    elasticSearchUserUpsert,
    handleAsync as handleAsyncImported,
    ICorePermission,
    ISyncElasticSearchService
} from 'services'

const withHandleAsync = <P extends Array<any>, T, U = Error>(
    callback: (...params: P) => Promise<T>
) => async (...params: P): Promise<[U, undefined] | [undefined, T]> => {
    return handleAsyncImported(callback(...params))
}

const syncElasticSearch: ISyncElasticSearchService = async (
    event,
    { elasticSearchClient, logger, error, handleAsync },
    context
) => {
    for (let i = 0; i < event.length; i += 1) {
        const eventItem = event[i]

        const eventItemValue = JSON.parse(eventItem.payload.value)
        const eventItemAction = eventItemValue.action
        const eventItemData = eventItemValue.data

        if (eventItemAction === 'CREATE') {
            if (eventItemData.id.startsWith('USER')) {
                const [clientUpdateError] = await elasticSearchUserUpsert(
                    { user: eventItemData },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                if (clientUpdateError)
                    throw error({
                        name: clientUpdateError.name,
                        message: clientUpdateError.message,
                        logger
                    })
            }

            if (eventItemData.id.startsWith('POST')) {
                const [clientUpdateError] = await elasticSearchPostUpsert(
                    { id: eventItemData.id, post: eventItemData },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                if (clientUpdateError)
                    throw error({
                        name: clientUpdateError.name,
                        message: clientUpdateError.message,
                        logger
                    })
            }

            if (
                eventItemData.id.startsWith('CATEGORY') &&
                eventItemData.id.startsWith('CATEGORY')
            ) {
                const [clientUpdateError] = await elasticSearchCategoryUpsert(
                    {
                        id: eventItemData.id,
                        category: eventItemData.category
                    },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                const [
                    clientUserUpdateError
                ] = await elasticSearchUserPermissionCreate(
                    {
                        id: eventItemData.user.id,
                        permissions: eventItemData.user.permissions
                    },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                if (clientUserUpdateError)
                    throw error({
                        name: clientUpdateError.name,
                        message: clientUpdateError.message,
                        logger
                    })

                if (clientUpdateError)
                    throw error({
                        name: clientUpdateError.name,
                        message: clientUpdateError.message,
                        logger
                    })
            }
        }

        if (eventItemAction === 'UPDATE') {
            if (eventItemData.id.startsWith('POST')) {
                const [clientUpdateError] = await elasticSearchPostUpsert(
                    { id: eventItemData.id, post: eventItemData },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                if (clientUpdateError)
                    throw error({
                        name: clientUpdateError.name,
                        message: clientUpdateError.message,
                        logger
                    })
            }

            if (
                eventItemData.id.startsWith('CATEGORY') &&
                eventItemData.id.startsWith('CATEGORY')
            ) {
                const [clientUpdateError] = await elasticSearchCategoryUpsert(
                    {
                        id: eventItemData.id,
                        category: eventItemData.category
                    },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                if (clientUpdateError)
                    throw error({
                        name: clientUpdateError.name,
                        message: clientUpdateError.message,
                        logger
                    })
            }
        }

        if (eventItemAction === 'DELETE') {
            if (eventItemData.id.startsWith('POST')) {
                const [deleteESPostError] = await elasticSearchPostDelete(
                    { id: eventItemData.id },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                if (deleteESPostError)
                    throw error({
                        name: deleteESPostError.name,
                        message: deleteESPostError.message,
                        logger
                    })
            }

            if (eventItemData.id.startsWith('CATEGORY')) {
                const [
                    deleteESCategoryError
                ] = await elasticSearchCategoryDelete(
                    { id: eventItemData.id },
                    { elasticSearchClient, error, handleAsync },
                    context
                )

                if (deleteESCategoryError)
                    throw error({
                        name: deleteESCategoryError.name,
                        message: deleteESCategoryError.message,
                        logger
                    })
            }
        }
    }
    return `Successfully processed.`
}

export default withHandleAsync(syncElasticSearch)
