import moment from 'moment'
import { ICoreCategory, IElasticSearchCategory } from 'services'

export const categoryToDoc = (post: ICoreCategory): IElasticSearchCategory => {
    const postModelData: IElasticSearchCategory = {
        id: `CATEGORY#${post.name.toLowerCase()}`,
        name: post.name,
        image: post.image || '',
        createdAt: post.createdAt || moment().toDate()
    }

    return postModelData
}
