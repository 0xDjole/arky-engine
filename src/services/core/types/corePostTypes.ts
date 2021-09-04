import {
    ICoreCategory,
    IServiceContext,
    IServiceContextReused,
    TCorePage
} from 'services'

export interface ICoreLocation {
    latitude: number
    longitude: number
}

export interface ICorePostKey {
    id: string
}

export interface ICorePostKeyData {
    name: string
    location: ICoreLocation
}

export interface ICorePostPreModel extends ICorePostKeyData {
    id?: string
    image?: string
    address?: string
    city?: string
    country?: string
    createdAt?: Date
}
export interface ICorePostInput extends ICorePostKeyData {
    image?: string
    address?: string
    city?: string
    country?: string
    categoryIds?: string[]
}

export interface ICorePostConnections {
    categories?: TCorePage<ICoreCategory>
}

export interface ICorePost extends ICorePostPreModel, ICorePostConnections {
    id: string
    createdAt: Date
}

export interface CoreUpdatePostData {
    image: string
    location: ICoreLocation
    categoryIds: string[]
}

export interface ICorePostUpdateInput {
    postKeyData: ICorePostKey
    updatePostData: CoreUpdatePostData
}

export interface ICorePostGetRandomFilter {
    location: ICoreLocation
    distance: number
    categoryNames: string[]
    matchAllCategories: boolean
}

export interface ICoreFeedGetInput {
    feedId: string
    cursor?: string
}

export interface ICorePageInfo {
    cursor: string
}

export interface ICoreFeedGet {
    posts: ICorePost[]
    pageInfo: ICorePageInfo
}

export type FCorePostCreate = (
    params: ICorePostInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICorePost>

export type FCorePostDelete = (
    params: ICorePostKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICorePost>

export type FCorePostGet = (
    params: ICorePostKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICorePost>

export type FCorePostGetRandom = (
    params: ICorePostGetRandomFilter,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICorePost>

export type FCoreFeedGet = (
    params: ICoreFeedGetInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreFeedGet>

export type FCorePostUpdate = (
    params: ICorePostUpdateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICorePost>
