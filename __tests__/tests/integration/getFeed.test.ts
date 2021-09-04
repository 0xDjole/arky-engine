import * as when from 'apiCall'
import {
    ECoreUserOAuth2Provider,
    error,
    EUserTokenType,
    handleAsync,
    ICoreCategory,
    ICorePost,
    ICoreUser
} from 'services'

import * as given from '../../steps/given'

describe('Get feed', () => {
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

    // afterAll(async () => {
    //     try {
    //         const [logoutError] = await handleAsync(
    //             when.weInvokeOAuth2Logout({
    //                 type: EUserTokenType.ACCESS_TOKEN,
    //                 value: user.token.accessToken,
    //                 permissionIds: user.permissions.map(
    //                     permissionItem => permissionItem.id
    //                 )
    //             })
    //         )

    //         if (logoutError) throw error(logoutError)

    //         const [deletePostError] = await handleAsync(
    //             when.weInvokeDeletePost(
    //                 {
    //                     payload: {
    //                         id: postCreated.id
    //                     }
    //                 },
    //                 {
    //                     authorization: user.token.accessToken
    //                 }
    //             )
    //         )
    //         if (deletePostError) throw error(deletePostError)
    //         await handleAsync(
    //             when.weInvokeDeleteCategory(
    //                 {
    //                     payload: { id: categoryCreated.id }
    //                 },
    //                 {
    //                     authorization: user.token.accessToken
    //                 }
    //             )
    //         )
    //     } catch (err) {
    //         throw error(err)
    //     }
    // })

    test('Should create post and return feed', async () => {
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

        const [getFeedError, getFeedData] = await handleAsync(
            when.weInvokeGetFeed(
                {
                    payload: {
                        feedId: 'default'
                    }
                },
                {
                    authorization: user.token.accessToken
                }
            )
        )

        if (getFeedError) throw error(getFeedError)

        expect(getFeedData.posts[0]).toMatchObject({
            name: createPostData.name,
            image: createPostData.image,
            location: createPostData.location
        })
    })
})
