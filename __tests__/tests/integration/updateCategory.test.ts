import * as when from 'apiCall'
import moment from 'moment'
import { error, handleAsync } from 'services'

import * as given from '../../steps/given'

describe('Update Category', () => {
    const newCategory = given.randomCategory()
    const updatedCategoryImage = `${
        given.randomCategory().image
    }-${moment().toDate()}`

    afterAll(async () => {
        const [deleteCategoryError] = await handleAsync(
            when.weInvokeDeleteCategory({
                payload: { id: newCategory.id }
            })
        )

        if (deleteCategoryError) throw error(deleteCategoryError)
    })

    test('Should create, update and return category', async () => {
        const [createCategoryError, createCategoryData] = await handleAsync(
            when.weInvokeCreateCategory({
                payload: newCategory
            })
        )

        if (createCategoryError) throw error(createCategoryError)

        const [updateCategoryError, updateCategoryData] = await handleAsync(
            when.weInvokeUpdateCategory({
                payload: {
                    categoryId: createCategoryData.id,
                    updateCategoryData: {
                        image: updatedCategoryImage
                    }
                }
            })
        )

        if (updateCategoryError) throw error(updateCategoryError)

        expect(updateCategoryData).toMatchObject({
            name: newCategory.name,
            image: updatedCategoryImage
        })
    })
})
