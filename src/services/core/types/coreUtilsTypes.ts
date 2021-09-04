import { AppSyncResolverEvent } from 'aws-lambda'
import { Producer } from 'kafkajs'
import {
    CassandraClient,
    ElasticSearchClient,
    ICoreUser,
    TKafkaEvent
} from 'services'
import { Logger } from 'winston'

export enum ECoreLanguage {
    'en-US'
}

export interface IErrorParams {
    message: string
    name?: string
    logger?: Logger
    throwIt?: boolean
}

export type FCoreError = (params: IErrorParams) => Error

export type FCoreLanguageGet = <T>(params: AppSyncResolverEvent<T>) => string

export type IHandleAsync = <T, U = Error>(
    promise: Promise<T>
) => Promise<[U, undefined] | [undefined, T]>

export enum ECoreOwnerConfiguration {
    OWNER_EMAIL = 'OWNER_EMAIL',
    OWNER_NAME = 'OWNER_NAME',
    OWNER_PASSWORD = 'OWNER_PASSWORD',
    OWNER_IMAGE = 'OWNER_IMAGE'
}

export interface IServiceContextReused {
    logger?: Logger
    cassandraClient?: CassandraClient
    kafkaProducer?: Producer
    elasticSearchClient?: ElasticSearchClient
    errorMessages?: { [key: string]: Record<string, any> }
    error?: FCoreError
    handleAsync?: IHandleAsync
}

export interface ICoreHeaders {
    authorization?: string
    [name: string]: string | undefined
}

export interface IServiceContext {
    language?: string
    user?: ICoreUser
    headers?: ICoreHeaders
    skipPermissionCheck?: boolean
}

export type FCoreInitLogger = () => Logger

export type ISyncElasticSearchService = (
    event: TKafkaEvent,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<string>

export type TCorePage<T> = T[]

export interface IPermissionMap {
    categoryIds: string[]
    action: string
    feature: string
    matchAllPermissions: boolean
}

export interface IPermissionMapGetResult {
    permissionIds: string[]
    matchAllPermissions: boolean
}

export interface IPermissionMapGetInput {
    [name: string]: string | undefined
}
