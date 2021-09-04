import * as when from 'apiCall'
import { error, handleAsync } from 'services'

import { categories } from '../raw'

export const up = async (): Promise<boolean> => {
    const [importCategoriesError] = await handleAsync(
        when.weInvokeImportCategories(categories)
    )

    if (importCategoriesError) throw error(importCategoriesError)

    return true
}

export const down = (): boolean => {
    return true
}
