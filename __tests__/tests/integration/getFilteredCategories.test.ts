import * as when from 'apiCall'
import { error, handleAsync } from 'services'

describe('Get Filtered Categories', () => {
    test('Should return categories', async () => {
        const [
            getFilteredCategoriesErorr,
            getFilteredCategoriesData
        ] = await handleAsync(when.weInvokeGetFilteredCategories())

        if (getFilteredCategoriesErorr) throw error(getFilteredCategoriesErorr)

        expect(getFilteredCategoriesData).not.toHaveLength(0)
    })
})
