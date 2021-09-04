import * as when from 'apiCall'
import {
    ECoreUserOAuth2Provider,
    error,
    errorMessages,
    EUserTokenType,
    handleAsync,
    ICoreCategory,
    ICoreUser
} from 'services'

import * as given from '../../steps/given'

describe('Create Category', () => {
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

    test('Should create and return category', async () => {
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

        expect(createCategoryData).toMatchObject({
            name: newCategory.name,
            image: newCategory.image
        })
    })

    test('Should failed creating same category', async () => {
        await expect(async () => {
            const [createCategoryError] = await handleAsync(
                when.weInvokeCreateCategory(
                    {
                        payload: newCategory
                    },
                    {
                        authorization: user.token.accessToken
                    },
                    false
                )
            )

            if (createCategoryError) throw error(createCategoryError)
        }).rejects.toEqual(
            error({
                name: 'ValidationError',
                message: errorMessages['en-US'].CATEGORY_ALREADY_EXISTS,
                throwIt: false
            })
        )
    })
})
