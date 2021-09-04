/* eslint-disable no-await-in-loop */
/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
import { IAppSyncInput, IPayload } from 'appSyncApi'
import {
    cassandraCategoryCreate,
    cassandraUserByTokenDelete,
    CassandraUserTokenDeleteInput,
    contextReused,
    EKafkaAction,
    error,
    EUserTokenType,
    handleAsync,
    ICoreCategoriesGetFilteredInput,
    ICoreCategory,
    ICoreCategoryInput,
    ICoreCategoryKey,
    ICoreCategoryUpdateInput,
    ICoreFeedGet,
    ICoreFeedGetInput,
    ICoreHeaders,
    ICorePost,
    ICorePostGetRandomFilter,
    ICorePostInput,
    ICorePostKey,
    ICorePostUpdateInput,
    ICoreUser,
    ICoreUserKey,
    ICoreUserOAuth2LoginInput,
    ICoreUserOAuth2LoginUrlGetInput,
    ICoreUserOAuth2RefreshAccessTokenInput,
    ICoreUserPermissionAssignInput,
    ICoreUserPermissionUnassignInput,
    ICoreUserUpdateInput,
    initKafka,
    toCategoryId,
    toPostId,
    toValidKafkaTopicName,
    waitForKafkaEvents
} from 'services'

import {
    categoriesGetFilteredHandler,
    categoryCreateHandler,
    categoryDeleteHandler,
    categoryGetHandler,
    categoryUpdateHandler
} from '../appSyncApi/services/category'
import { feedGetHandler } from '../appSyncApi/services/feed'
import {
    postCreateHandler,
    postDeleteHandler,
    postGetHandler,
    postGetRandomHandler,
    postUpdateHandler,
    syncElasticSearchHandler
} from '../appSyncApi/services/post'
import {
    userDeleteHandler,
    userGetMeHandler,
    userOAuth2LoginHandler,
    userOAuth2LoginUrlGetHandler,
    userOAuth2RefreshAccessTokenHandler,
    userPermissionAssignHandler,
    userPermissionUnassignHandler,
    userUpdateHandler
} from '../appSyncApi/services/user'
import { getDefaultEvent } from './utils'

const withElasticSearchSync = async <T>(
    id: string,
    action: EKafkaAction,
    callback: () => Promise<T>,
    shouldCreateTopic = true
): Promise<T> => {
    const topic = toValidKafkaTopicName(id, action)

    const kafkaClient = initKafka()
    const adminKafkaClient = kafkaClient.admin()

    try {
        await handleAsync(adminKafkaClient.connect())

        shouldCreateTopic &&
            (await handleAsync(
                adminKafkaClient.createTopics({
                    topics: [
                        {
                            topic,
                            replicationFactor:
                                process.env.APP_LOCAL === 'true' ? 1 : 3
                        }
                    ]
                })
            ))

        const [callbackError, callbackData] = await handleAsync(callback())

        if (callbackError) throw error(callbackError)

        const [kafkaEventsError, kafkaEvents] = await handleAsync(
            waitForKafkaEvents(
                kafkaClient,
                1,
                true,
                toValidKafkaTopicName(id, action),
                toValidKafkaTopicName(id, action)
            )
        )

        if (kafkaEventsError) throw error(kafkaEventsError)

        const [syncElasticSearchError] = await handleAsync(
            syncElasticSearchHandler(kafkaEvents)
        )

        if (syncElasticSearchError) throw error(syncElasticSearchError)
        return callbackData
    } finally {
        shouldCreateTopic &&
            (await handleAsync(
                adminKafkaClient.deleteTopics({
                    topics: [topic]
                })
            ))
        await handleAsync(adminKafkaClient.disconnect())
    }
}

export const weInvokeCreatePost = async (
    createPostInput: IPayload<ICorePostInput>,
    headers?: ICoreHeaders
): Promise<ICorePost> =>
    withElasticSearchSync(
        toPostId(createPostInput.payload),
        EKafkaAction.CREATE,
        async () => {
            const event = getDefaultEvent(
                createPostInput,
                'createPost',
                headers.authorization
            )

            const [createPostError, createPostData] = await handleAsync(
                postCreateHandler(event)
            )

            if (createPostError) throw error(createPostError)

            return createPostData
        }
    )

export const weInvokeGetFeed = async (
    getFeedInput: IPayload<ICoreFeedGetInput>,
    headers?: ICoreHeaders
): Promise<ICoreFeedGet> => {
    const event = getDefaultEvent(
        getFeedInput,
        'getFeed',
        headers.authorization
    )

    const [getFeedError, getFeedData] = await handleAsync(feedGetHandler(event))

    if (getFeedError) throw error(getFeedError)

    return getFeedData
}

export const weInvokeImportPosts = async (
    importPostsInput: ICorePostInput[]
): Promise<ICorePost[]> => {
    for (let i = 0; i < importPostsInput.length; i += 1) {
        const postInput = importPostsInput[i]
        await weInvokeCreatePost({
            payload: {
                ...postInput,
                image:
                    postInput.image || `${process.env.S3_URL}/icons/venue.png`
            }
        })
    }

    return []
}

export const weInvokeCreateCategory = async (
    categoryInput: IPayload<ICoreCategoryInput>,
    headers?: ICoreHeaders,
    shouldCreateTopic = true
): Promise<ICoreCategory> =>
    withElasticSearchSync(
        toCategoryId(categoryInput.payload),
        EKafkaAction.CREATE,
        async () => {
            const event = getDefaultEvent(
                categoryInput,
                'createCategory',
                headers.authorization
            )

            const [createCategoryError, createCategoryData] = await handleAsync(
                categoryCreateHandler(event)
            )

            if (createCategoryError) throw error(createCategoryError)

            return createCategoryData
        },
        shouldCreateTopic
    )

export const weInvokeImportCategories = async (
    importCategoriesInput: ICoreCategoryInput[]
): Promise<ICoreCategory[]> => {
    const contextReusedValue = await contextReused()

    let categories: ICoreCategory[] = []
    for (let i = 0; i < importCategoriesInput.length; i += 1) {
        const categoryInput = importCategoriesInput[i]
        const [, cassandraCategoryCreateData] = await cassandraCategoryCreate(
            categoryInput,
            contextReusedValue,
            {
                language: 'en',
                skipPermissionCheck: true
            }
        )

        categories = [...categories, cassandraCategoryCreateData]
    }

    contextReusedValue.cassandraClient.shutdown()
    return categories
}

export const weInvokeGetRandomPost = async (
    randomPostFilter: IPayload<ICorePostGetRandomFilter>
): Promise<ICorePost> => {
    const event = getDefaultEvent(randomPostFilter, 'getRandomPost', '')
    const [getRandomPostError, getRandomPostData] = await handleAsync(
        postGetRandomHandler(event)
    )

    if (getRandomPostError) throw error(getRandomPostError)

    return getRandomPostData
}

export const weInvokeGetPost = async (
    getPostInput: IPayload<ICorePostKey>,
    headers?: ICoreHeaders
): Promise<ICorePost> => {
    const event = getDefaultEvent(
        getPostInput,
        'getPost',
        headers.authorization
    )

    const [getPostError, getPostData] = await handleAsync(postGetHandler(event))

    if (getPostError) throw error(getPostError)

    return getPostData
}

export const weInvokeUpdatePost = async (
    updatePostInput: IPayload<ICorePostUpdateInput>
): Promise<ICorePost> =>
    withElasticSearchSync(
        updatePostInput.payload.postKeyData.id,
        EKafkaAction.UPDATE,

        async () => {
            const event = getDefaultEvent(updatePostInput, 'updatePost', '')

            const [updatePostError, updatePostData] = await handleAsync(
                postUpdateHandler(event)
            )

            if (updatePostError) throw error(updatePostError)

            return updatePostData
        }
    )

export const weInvokeGetCategory = async (
    categoryInput: IPayload<ICoreCategoryKey>,
    headers?: ICoreHeaders
): Promise<ICoreCategory> => {
    const event: IAppSyncInput<ICoreCategoryKey> = getDefaultEvent(
        categoryInput,
        'getCategory',
        headers.authorization
    )

    const [getCategoryError, getCategoryData] = await handleAsync(
        categoryGetHandler(event)
    )

    if (getCategoryError) throw error(getCategoryError)

    return getCategoryData
}

export const weInvokeGetFilteredCategories = async (): Promise<
    ICoreCategory[]
> => {
    const event: IAppSyncInput<ICoreCategoriesGetFilteredInput> = getDefaultEvent(
        {},
        'getFilteredCategories',
        ''
    )

    const [
        getFilteredCategoriesError,
        getFilteredCategoriesData
    ] = await handleAsync(categoriesGetFilteredHandler(event))

    if (getFilteredCategoriesError) throw error(getFilteredCategoriesError)

    return getFilteredCategoriesData
}

export const weInvokeUpdateCategory = async (
    updateCategoryInput: IPayload<ICoreCategoryUpdateInput>,
    headers?: ICoreHeaders
): Promise<ICoreCategory> =>
    withElasticSearchSync(
        updateCategoryInput.payload.categoryId,
        EKafkaAction.UPDATE,

        async () => {
            const event = getDefaultEvent(
                updateCategoryInput,
                'updateCategory',
                headers.authorization
            )

            const [
                updateCategoryHandlerError,
                updateCategoryHandlerData
            ] = await handleAsync(categoryUpdateHandler(event))

            if (updateCategoryHandlerError)
                throw error(updateCategoryHandlerError)

            return updateCategoryHandlerData
        }
    )

export const weInvokeDeleteCategory = async (
    categoryInput: IPayload<ICoreCategoryKey>,
    headers?: ICoreHeaders
): Promise<ICoreCategory> =>
    withElasticSearchSync(
        categoryInput.payload.id,
        EKafkaAction.DELETE,

        async () => {
            const event = getDefaultEvent(
                categoryInput,
                'deleteCategory',
                headers.authorization
            )

            const [
                deletedCategoryError,
                deleteCategoryData
            ] = await handleAsync(categoryDeleteHandler(event))

            if (deletedCategoryError) throw error(deletedCategoryError)

            return deleteCategoryData
        }
    )

export const weInvokeDeletePost = async (
    deletePostInput: IPayload<ICorePostKey>,
    headers?: ICoreHeaders
): Promise<ICoreCategory> =>
    withElasticSearchSync(
        deletePostInput.payload.id,
        EKafkaAction.DELETE,
        async () => {
            const event = getDefaultEvent(
                deletePostInput,
                'deletePost',
                headers.authorization
            )

            const [deletePostError, deletePostData] = await handleAsync(
                postDeleteHandler(event)
            )

            if (deletePostError) throw error(deletePostError)

            return deletePostData
        }
    )

export const weInvokeGetLoginUrl = async (
    getLoginUrlInput: IPayload<
        Omit<ICoreUserOAuth2LoginUrlGetInput, 'originURI'>
    >
): Promise<string> => {
    const event = getDefaultEvent(getLoginUrlInput, 'getLoginUrl', '')

    const [getLoginUrlError, getLoginUrlData] = await handleAsync(
        userOAuth2LoginUrlGetHandler(event)
    )

    if (getLoginUrlError) throw error(getLoginUrlError)

    return getLoginUrlData
}

export const weInvokeOAuth2Login = async (
    params: IPayload<Omit<ICoreUserOAuth2LoginInput, 'originURI'>>
): Promise<ICoreUser> => {
    const event = getDefaultEvent(params, 'loginOAuth2', '')

    const [getLoginUrlError, getLoginUrlData] = await handleAsync(
        userOAuth2LoginHandler(event)
    )

    if (getLoginUrlError) throw error(getLoginUrlError)

    return getLoginUrlData
}

export const weInvokeOAuth2RefreshAccessToken = async (
    params: IPayload<Omit<ICoreUserOAuth2RefreshAccessTokenInput, 'originURI'>>
): Promise<ICoreUser> => {
    const event = getDefaultEvent(params, 'loginOAuth2', '')

    const [getLoginUrlError, getLoginUrlData] = await handleAsync(
        userOAuth2RefreshAccessTokenHandler(event)
    )

    if (getLoginUrlError) throw error(getLoginUrlError)

    return getLoginUrlData
}

export const weInvokeOAuth2Logout = async (
    params: CassandraUserTokenDeleteInput
): Promise<boolean> => {
    const contextReusedValue = await contextReused()

    const [
        cassandraUserByTokenDeleteError,
        cassandraUserByTokenDeleteData
    ] = await cassandraUserByTokenDelete(params, contextReusedValue, {
        language: 'en-US'
    })

    contextReusedValue.cassandraClient.shutdown()

    if (cassandraUserByTokenDeleteError)
        throw error(cassandraUserByTokenDeleteError)

    return cassandraUserByTokenDeleteData
}

export const aUserCallsGetMe = async (
    openIdToken: string
): Promise<ICoreUser> => {
    const event = getDefaultEvent({}, 'getMe', openIdToken)

    const [getMeError, getMeData] = await handleAsync(userGetMeHandler(event))

    if (getMeError) throw error(getMeError)

    return getMeData
}

export const aUserCallsUpdateUser = async (
    updateUser: IPayload<ICoreUserUpdateInput>,
    openIdToken: string
): Promise<ICoreUser> => {
    const event = getDefaultEvent(updateUser, 'updateUser', openIdToken)

    const [updateUserError, updateUserData] = await handleAsync(
        userUpdateHandler(event)
    )

    if (updateUserError) throw error(updateUserError)

    return updateUserData
}

export const weInvokeUserPermissionAssign = async (
    assignPermission: IPayload<ICoreUserPermissionAssignInput>,
    openIdToken: string
): Promise<boolean> => {
    const event = getDefaultEvent(
        assignPermission,
        'assignPermission',
        openIdToken
    )

    const [
        userPermissionAssignError,
        userPermissionAssignData
    ] = await handleAsync(userPermissionAssignHandler(event))

    if (userPermissionAssignError) throw error(userPermissionAssignError)

    return userPermissionAssignData
}

export const weInvokeUnassignPermission = async (
    unassignPermission: IPayload<ICoreUserPermissionUnassignInput>,
    openIdToken: string
): Promise<boolean> => {
    const event = getDefaultEvent(
        unassignPermission,
        'unassignPermission',
        openIdToken
    )

    const [unassignPermissionError, unassignPermissionData] = await handleAsync(
        userPermissionUnassignHandler(event)
    )

    if (unassignPermissionError) throw error(unassignPermissionError)

    return unassignPermissionData
}

export const weInvokeDeleteUser = async (
    user: IPayload<ICoreUserKey>
): Promise<ICoreUser> => {
    const event = getDefaultEvent(user, 'deleteUser', '')

    const [deleteUserError, deleteUserData] = await handleAsync(
        userDeleteHandler(event)
    )

    if (deleteUserError) throw error(deleteUserError)

    return deleteUserData
}
