/* eslint-disable jest/expect-expect */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
import * as when from 'apiCall'
import { error, handleAsync } from 'services'

import { posts } from '../raw'

export const up = async (): Promise<boolean> => {
    const [importPostsError] = await handleAsync(
        when.weInvokeImportPosts(posts)
    )

    if (importPostsError) throw error(importPostsError)

    return true
}

export const down = (): boolean => {
    return true
}
