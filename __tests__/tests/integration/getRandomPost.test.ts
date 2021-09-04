import * as when from 'apiCall'
import { sleep } from 'apiCall/utils'
import { error, handleAsync } from 'services'

import * as given from '../../steps/given'

describe('Get a random post', () => {
    const newPost = given.randomPost()

    afterAll(async () => {
        const [deletePostError] = await handleAsync(
            when.weInvokeDeletePost({
                payload: {
                    id: newPost.id
                }
            })
        )

        if (deletePostError) throw error(deletePostError)
    })

    test('Should create and return as random post', async () => {
        const [postError, createPostData] = await handleAsync(
            when.weInvokeCreatePost({
                payload: {
                    ...newPost,
                    categoryIds: []
                }
            })
        )

        if (postError) throw error(postError)

        await sleep(1000)
        const [randomPostError, randomPostData] = await handleAsync(
            when.weInvokeGetRandomPost({
                payload: {
                    location: createPostData.location,
                    distance: 10,
                    categoryNames: [],
                    matchAllCategories: false
                }
            })
        )

        if (randomPostError) throw error(randomPostError)

        expect(randomPostData).toMatchObject({
            name: createPostData.name,
            image: createPostData.image,
            location: createPostData.location
        })
    })
})

describe('Get a random post with categories', () => {
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
                payload: { id: newCategory.id }
            })
        )
    })

    test('Should create and return as random post', async () => {
        const [createCategoryError, createCategoryData] = await handleAsync(
            when.weInvokeCreateCategory({
                payload: newCategory
            })
        )

        if (createCategoryError) throw error(createCategoryError)

        const [createPostError, createPostData] = await handleAsync(
            when.weInvokeCreatePost({
                payload: {
                    ...newPost,
                    categoryIds: [createCategoryData.id]
                }
            })
        )

        if (createPostError) throw error(createPostError)

        await sleep(1000)

        const [randomPostError, randomPostData] = await handleAsync(
            when.weInvokeGetRandomPost({
                payload: {
                    location: createPostData.location,
                    distance: 10,
                    categoryNames: [],
                    matchAllCategories: false
                }
            })
        )

        if (randomPostError) throw error(randomPostError)

        expect(randomPostData).toMatchObject({
            name: createPostData.name,
            image: createPostData.image,
            categories: [
                {
                    ...createCategoryData,
                    createdAt: createCategoryData.createdAt.toISOString()
                }
            ],
            location: createPostData.location
        })
    })
})
