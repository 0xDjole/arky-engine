import * as when from 'apiCall'
import { error, handleAsync } from 'services'

import * as given from '../../steps/given'

describe('Update Post', () => {
    const newPost = given.randomPost()
    const newPostData = given.randomPost()
    const newCategory = given.randomCategory()
    const newCategoryForUpdatedPost = given.randomCategory()

    afterAll(async () => {
        const [deletePostError] = await handleAsync(
            when.weInvokeDeletePost({
                payload: {
                    id: newPost.id
                }
            })
        )
        if (deletePostError) throw error(deletePostError)

        const [deleteCategoryError] = await handleAsync(
            when.weInvokeDeleteCategory({
                payload: { id: newCategory.id }
            })
        )

        if (deleteCategoryError) throw error(deleteCategoryError)

        const [deleteCategoryError2] = await handleAsync(
            when.weInvokeDeleteCategory({
                payload: { id: newCategoryForUpdatedPost.id }
            })
        )

        if (deleteCategoryError2) throw error(deleteCategoryError2)
    })

    it('Should update created post', async () => {
        const [createCategoryError, createCategoryData] = await handleAsync(
            when.weInvokeCreateCategory({
                payload: newCategory
            })
        )

        if (createCategoryError) throw error(createCategoryError)

        const [
            categoryForUpdatedPostError,
            categoryForUpdatedPostData
        ] = await handleAsync(
            when.weInvokeCreateCategory({
                payload: newCategoryForUpdatedPost
            })
        )

        if (categoryForUpdatedPostError)
            throw error(categoryForUpdatedPostError)

        const [createPostError, createPostData] = await handleAsync(
            when.weInvokeCreatePost({
                payload: {
                    ...newPost,
                    categoryIds: [createCategoryData.id]
                }
            })
        )

        if (createPostError) throw error(createPostError)

        const [updatePostError, updatePostData] = await handleAsync(
            when.weInvokeUpdatePost({
                payload: {
                    postKeyData: {
                        id: createPostData.id
                    },
                    updatePostData: {
                        image: newPostData.image,
                        location: newPostData.location,
                        categoryIds: [categoryForUpdatedPostData.id]
                    }
                }
            })
        )

        if (updatePostError) throw error(updatePostError)

        expect(updatePostData).toMatchObject({
            name: newPost.name,
            image: newPostData.image,
            location: newPost.location
        })
    })
})
