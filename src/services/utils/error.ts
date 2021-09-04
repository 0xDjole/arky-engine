import { errorTypes, FCoreError } from 'services'

const types = [
    'Error',
    'ValidationError',
    'NotAuthorizedError',
    'MissingParametersError'
]

const error: FCoreError = ({ message, name = 'Error', logger }) => {
    if (logger) {
        logger.error(message)
    }

    const errorName = types.includes(name) ? name : 'Error'

    return new errorTypes[errorName](message)
}

export default error
