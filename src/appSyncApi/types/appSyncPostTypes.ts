import { IAppSyncInput } from 'appSyncApi'
import {
    ICorePost,
    ICorePostGetRandomFilter,
    ICorePostInput,
    ICorePostKey,
    ICorePostUpdateInput,
    TKafkaEvent
} from 'services'

export type FAppSyncPostCreate = (
    event: IAppSyncInput<ICorePostInput>
) => Promise<ICorePost>

export type FAppSyncPostDelete = (
    event: IAppSyncInput<ICorePostKey>
) => Promise<ICorePost>

export type FAppSyncPostsGetFiltered = (
    event: IAppSyncInput<ICorePostKey>
) => Promise<ICorePost>

export type FAppSyncPostGet = (
    event: IAppSyncInput<ICorePostKey>
) => Promise<ICorePost>

export type FAppSyncPostGetRandom = (
    event: IAppSyncInput<ICorePostGetRandomFilter>
) => Promise<ICorePost>

export type FAppSyncElasticSearch = (event: TKafkaEvent) => Promise<string>

export type FAppSyncPostUpdate = (
    event: IAppSyncInput<ICorePostUpdateInput>
) => Promise<ICorePost>
