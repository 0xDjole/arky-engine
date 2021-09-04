import {
    CassandraCategory,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface CassandraPostConnections {
    categories?: CassandraCategory[]
}

export interface CassandraLocation {
    latitude: number
    longitude: number
}

export interface CassandraPostKey {
    id: string
}

export interface CassandraPostKeyData {
    name: string
    location: CassandraLocation
}

export interface CassandraPostPreModel extends CassandraPostKeyData {
    id?: string
    image?: string
    address?: string
    city?: string
    country?: string
    createdAt?: Date
}

export interface CassandraPost
    extends CassandraPostPreModel,
        CassandraPostConnections {
    id: string
    createdAt: Date
}

export interface CassandraPostInput {
    name: string
    location: CassandraLocation
    image?: string
    address?: string
    city?: string
    country?: string
    categoryIds?: string[]
}

export interface ICassandraPostsByCategory {
    posts: CassandraPost[]
    category: CassandraCategory
}

export interface CassandraUpdatePostData {
    image: string
    location: CassandraLocation
    categoryIds: string[]
}

export interface CassandraUpdatePostInput {
    postKeyData: CassandraPostKey
    updatePostData: CassandraUpdatePostData
}

export interface CassandraPostsByFeedDeleteInput {
    post: CassandraPost
}

export interface CassandraPostsByFeedCreateInput {
    post: CassandraPost
    feedId: string
    userId: string
    day: string
}

export interface ICassandraPostsByFeedGetInput {
    feedId: string
    userId: string
    cursor: string
}

export interface IPageInfo {
    cursor: string
}

export interface ICassandraPostsByFeedGet {
    posts: CassandraPost[]
    pageInfo: IPageInfo
}

export type FCassandraPostCreate = (
    params: CassandraPostInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraPost>

export type FCassandraPostDelete = (
    params: CassandraPostKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraPost>

export type FCassandraPostGet = (
    params: CassandraPostKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraPost>

export type FCassandraPostsByCategoryDelete = (
    params: ICassandraPostsByCategory,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type FCassandraPostsByCategoryGet = (
    params: CassandraCategory,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICassandraPostsByCategory>

export type FCassandraPostsByFeedDelete = (
    params: CassandraPostsByFeedDeleteInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type FCassandraPostsByFeedCreate = (
    params: CassandraPostsByFeedCreateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraPost>

export type FCassandraPostsByFeedGet = (
    params: ICassandraPostsByFeedGetInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICassandraPostsByFeedGet>

export type FCassandraPostUpdate = (
    params: CassandraUpdatePostInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraPost>
