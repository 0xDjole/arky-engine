import faker from 'faker'
import moment from 'moment'
import { cassandraCategoryModel, ICoreCategory } from 'services'

const aRandomCategory = (): ICoreCategory => {
    const name = `${faker.lorem.word(
        5
    )}-${moment().toISOString()}-${faker.lorem.word(5)}`

    const image = faker.image.imageUrl()

    return cassandraCategoryModel({
        name,
        image
    })
}

export default aRandomCategory
