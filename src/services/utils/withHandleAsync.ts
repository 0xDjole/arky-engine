import { handleAsync } from 'services'

const withHandleAsync = <P extends Array<any>, T, U = Error>(
    callback: (...params: P) => Promise<T>
) => async (...params: P): Promise<[U, undefined] | [undefined, T]> => {
    return handleAsync(callback(...params))
}

export default withHandleAsync
