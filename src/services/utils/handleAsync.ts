import { IHandleAsync } from 'services'

const handleAsync: IHandleAsync = <T, U>(promise: Promise<T>) => {
    return promise
        .then<[undefined, T]>((data: T) => [undefined, data])
        .catch<[U, undefined]>((err: U) => [err, undefined])
}

export default handleAsync
