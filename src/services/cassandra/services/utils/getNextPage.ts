import { ICassandraPage } from 'services'

const getNextPage = (page: ICassandraPage): ICassandraPage => {
    if (page.itemCount >= 10) {
        return {
            itemCount: 1,
            number: page.number + 1,
            totalCount: page.totalCount + 1
        }
    }

    return {
        itemCount: page.itemCount + 1,
        number: page.number,
        totalCount: page.totalCount
    }
}

export default getNextPage
