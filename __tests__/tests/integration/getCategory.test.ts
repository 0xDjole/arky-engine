import * as when from 'apiCall'
import {
    ECoreUserOAuth2Provider,
    error,
    errorMessages,
    EUserTokenType,
    handleAsync,
    ICoreCategory,
    ICoreUser,
    toCategoryId
} from 'services'

import * as given from '../../steps/given'

describe('Get Category', () => {
    const newCategory = given.randomCategory()
    let createdCategory: ICoreCategory
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
        const [deleteCategoryError] = await handleAsync(
            when.weInvokeDeleteCategory(
                {
                    payload: {
                        id: createdCategory.id
                    }
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

        if (deleteCategoryError || logoutError) throw error(deleteCategoryError)
    })

    test('Should create and get category', async () => {
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

        createdCategory = createCategoryData
        user.permissions = [
            ...new Set([...user.permissions, ...createdCategory.permissions])
        ]

        const [getPostError, getPostData] = await handleAsync(
            when.weInvokeGetCategory(
                {
                    payload: {
                        id: newCategory.id
                    }
                },
                {
                    authorization: user.token.accessToken
                }
            )
        )

        if (getPostError) throw error(getPostError)

        expect(getPostData).toMatchObject({
            name: newCategory.name
        })
    })

    test('Get non-existant category should return error', async () => {
        const categoryName = given.nonExistantName()
        await expect(async () => {
            const [getCategoryError] = await handleAsync(
                when.weInvokeGetCategory(
                    {
                        payload: {
                            id: toCategoryId({ name: categoryName })
                        }
                    },
                    {
                        authorization: user.token.accessToken
                    }
                )
            )

            if (getCategoryError) throw error(getCategoryError)
        }).rejects.toEqual(
            error({
                message: errorMessages['en-US'].USER_NOT_AUTHORIZED,
                throwIt: false
            })
        )
    })
})
