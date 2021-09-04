import * as when from 'apiCall'
import { error, handleAsync } from 'services'

import * as given from '../../steps/given'

describe('Import categories', () => {
    const newCategory = given.randomCategory()

    afterAll(async () => {
        const [deleteCategoryError] = await handleAsync(
            when.weInvokeDeleteCategory({
                payload: {
                    id: newCategory.id
                }
            })
        )
        if (deleteCategoryError) throw error(deleteCategoryError)
    })

    test('Should import categories', async () => {
        const [importCategoriesError, importCategoriesData] = await handleAsync(
            when.weInvokeImportCategories([newCategory])
        )

        if (importCategoriesError) throw error(importCategoriesError)

        expect(importCategoriesData).toBeTruthy()
    })
})
