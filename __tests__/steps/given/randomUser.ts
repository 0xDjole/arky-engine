import faker from 'faker'
import { IRandomUser, toUserId } from 'services'

const randomUser = (): IRandomUser => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const suffix = faker.lorem.word(4)

    const email = `${firstName}-${lastName}-${suffix}@toxtest.com`.toLowerCase()
    const name = `${firstName} ${lastName} ${suffix}`
    const password = `${email[0].toUpperCase() + email.slice(1)}-123!`

    const image = faker.image.imageUrl()

    return {
        id: toUserId({ email }),
        email,
        name,
        image,
        password
    }
}

export default randomUser
