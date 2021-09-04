import faker from 'faker'

const nonExistantName = (): string => faker.random.uuid()

export default nonExistantName
