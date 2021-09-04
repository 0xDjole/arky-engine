import * as when from 'apiCall'
import {
    ECoreUserOAuth2Provider,
    error,
    errorMessages,
    EUserTokenType,
    handleAsync,
    ICoreCategory,
    ICorePost,
    ICoreUser
} from 'services'

import * as given from '../../steps/given'

describe('Create post with 1 category', () => {
    const newPost = given.randomPost()
    const newCategory = given.randomCategory()
    let postCreated: ICorePost
    let categoryCreated: ICoreCategory

    let user: ICoreUser

    beforeAll(async () => {
        const [
            refreshAccessTokenError,
            refreshAccessTokenData
        ] = await handleAsync(
            when.weInvokeOAuth2RefreshAccessToken({
                payload: {
                    refreshToken: process.env.GOOGLE_REFRESH_ACCESS_TOKEN,
                    provider: ECoreUserOAuth2Provider.GOOGLE
                }
            })
        )

        if (refreshAccessTokenError) throw error(refreshAccessTokenError)

        user = refreshAccessTokenData
    })

    afterAll(async () => {
        await handleAsync(
            when.weInvokeDeletePost(
                {
                    payload: {
                        id: postCreated.id
                    }
                },
                {
                    authorization: user.token.accessToken
                }
            )
        )

        await handleAsync(
            when.weInvokeDeleteCategory(
                {
                    payload: { id: categoryCreated.id }
                },
                {
                    authorization: user.token.accessToken
                }
            )
        )

        const [logoutError] = await handleAsync(
            when.weInvokeOAuth2Logout({
                type: EUserTokenType.ACCESS_TOKEN,
                value: user.token.accessToken,
                permissionIds: user.permissions.map(
                    permissionItem => permissionItem.id
                )
            })
        )

        if (logoutError) throw error(logoutError)
    })

    test('Should create post', async () => {
        const [createCategoryError, createCategoryData] = await handleAsync(
            when.weInvokeCreateCategory(
                {
                    payload: newCategory
                },
                {
                    authorization: user.token.accessToken
                }
            )
        )

        if (createCategoryError) throw error(createCategoryError)

        categoryCreated = createCategoryData

        const [createPostError, createPostData] = await handleAsync(
            when.weInvokeCreatePost(
                {
                    payload: {
                        ...newPost,
                        location: newPost.location,
                        categoryIds: [createCategoryData.id]
                    }
                },
                {
                    authorization: user.token.accessToken
                }
            )
        )

        if (createPostError) throw error(createPostError)

        postCreated = createPostData

        expect(createPostData).toMatchObject({
            name: newPost.name,
            image: newPost.image,
            location: newPost.location
        })
    })

    test('Should fail creating a post', async () => {
        const newCategory2 = given.randomCategory()

        const newPost2 = given.randomPost()
        await expect(async () => {
            const [createPostError] = await handleAsync(
                when.weInvokeCreatePost(
                    {
                        payload: {
                            ...newPost2,
                            categoryIds: [newCategory2.id]
                        }
                    },
                    {
                        authorization: user.token.accessToken
                    }
                )
            )
            if (createPostError) throw error(createPostError)
        }).rejects.toEqual(
            error({
                message: errorMessages['en-US'].USER_NOT_AUTHORIZED,
                throwIt: false
            })
        )
    })

    test('Should fail creating a post because categories', async () => {
        const newCategories = [...new Array(21)].map(() =>
            given.randomCategory()
        )

        const newPost2 = given.randomPost()

        await expect(async () => {
            const [createPostError] = await handleAsync(
                when.weInvokeCreatePost(
                    {
                        payload: {
                            ...newPost2,
                            categoryIds: newCategories.map(
                                category => category.id
                            )
                        }
                    },
                    {
                        authorization: user.token.accessToken
                    }
                )
            )

            if (createPostError) throw error(createPostError)
        }).rejects.toEqual(
            error({
                message: errorMessages['en-US'].USER_NOT_AUTHORIZED,
                throwIt: false
            })
        )
    })
})
