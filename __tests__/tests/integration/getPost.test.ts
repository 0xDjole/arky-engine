import * as when from 'apiCall'
import { error, errorMessages, handleAsync } from 'services'

import * as given from '../../steps/given'

describe('Get Create and get post', () => {
    const newPost = given.randomPost()

    afterAll(async () => {
        await handleAsync(
            when.weInvokeDeletePost({
                payload: {
                    id: newPost.id
                }
            })
        )
    })

    test('Should return post by name', async () => {
        const [createPostServiceError] = await handleAsync(
            when.weInvokeCreatePost({
                payload: {
                    ...newPost,
                    categoryIds: []
                }
            })
        )

        if (createPostServiceError) throw error(createPostServiceError)

        const [getPostError, getPostData] = await handleAsync(
            when.weInvokeGetPost({
                payload: {
                    id: newPost.id
                }
            })
        )

        if (getPostError) throw error(getPostError)

        expect(getPostData).toMatchObject({
            name: newPost.name,
            image: newPost.image,
            location: newPost.location,
            categories: []
        })
    })
})

describe('Get non-existant post', () => {
    test('Should return error', async () => {
        const newPost = given.randomPost()
        await expect(async () => {
            const [getPostError] = await handleAsync(
                when.weInvokeGetPost({
                    payload: {
                        id: newPost.id
                    }
                })
            )

            if (getPostError) throw error(getPostError)
        }).rejects.toEqual(
            error({
                message: errorMessages['en-US'].POST_DOES_NOT_EXIST,
                throwIt: false
            })
        )
    })
})

describe('Get post by name with 1 category', () => {
    const newPost = given.randomPost()
    const newCategory = given.randomCategory()

    afterAll(async () => {
        await handleAsync(
            when.weInvokeDeletePost({
                payload: {
                    id: newPost.id
                }
            })
        )

        await handleAsync(
            when.weInvokeDeleteCategory({
                payload: {
                    id: newCategory.id
                }
            })
        )
    })

    test('Should match post and 1 category', async () => {
        const [createCategoryError, createCategoryData] = await handleAsync(
            when.weInvokeCreateCategory({
                payload: newCategory
            })
        )

        if (createCategoryError) throw error(createCategoryError)

        const [
            createPostServiceError,
            createPostServiceData
        ] = await handleAsync(
            when.weInvokeCreatePost({
                payload: {
                    ...newPost,
                    categoryIds: [createCategoryData.id]
                }
            })
        )

        if (createPostServiceError) throw error(createPostServiceError)

        const [getPostError, getPostData] = await handleAsync(
            when.weInvokeGetPost({
                payload: {
                    id: createPostServiceData.id
                }
            })
        )

        if (getPostError) throw error(getPostError)

        expect(getPostData).toMatchObject({
            name: newPost.name,
            image: newPost.image,
            location: newPost.location,
            categories: [
                {
                    name: createCategoryData.name,
                    image: createCategoryData.image,
                    createdAt: createCategoryData.createdAt
                }
            ]
        })
    })
})
