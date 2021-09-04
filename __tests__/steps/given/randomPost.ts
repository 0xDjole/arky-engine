import faker from 'faker'
import moment from 'moment'
import { cassandraPostModel, ICorePost } from 'services'

const randomPost = (): ICorePost => {
    const name = `${faker.lorem.word(
        5
    )}-${moment().toISOString()}-${faker.lorem.word(5)}`

    const image = faker.image.imageUrl()

    const longitude = +faker.random.number(50) + 1
    const latitude = +faker.random.number(50) + 1

    return cassandraPostModel(
        {
            name,
            image,
            location: { longitude, latitude }
        },
        'en-US'
    )
}

export default randomPost
