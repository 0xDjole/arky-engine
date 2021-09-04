import { AppSyncResolverEvent } from 'aws-lambda'

export interface IPayload<T> {
    payload?: T
}

export type IAppSyncInput<T> = AppSyncResolverEvent<IPayload<T>>

export type IGetDefaltEvent = <T>(
    eventArguments: T,
    eventFieldName: string,
    openIdToken: string
) => AppSyncResolverEvent<T>
