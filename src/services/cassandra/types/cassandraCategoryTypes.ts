import {
    CassandraPermission,
    CassandraPost,
    CassandraPostKey,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface CassandraCategoryConnections {
    permissions?: CassandraPermission[]
}

export interface CassandraCategoryKey {
    id: string
}

export interface CassandraCategoryKeyData {
    name: string
}

export interface CassandraCategoryPreModel extends CassandraCategoryKeyData {
    id?: string
    image?: string
    createdAt?: Date
}

export interface CassandraCategory
    extends CassandraCategoryPreModel,
        CassandraCategoryConnections {
    id: string
    createdAt: Date
}

export interface CassandraCategoryWithPosts extends CassandraCategory {
    posts: CassandraPost[]
}

export interface ICassandraCategoriesByPost {
    categories: CassandraCategory[]
    post: CassandraPost
}

export interface CassandraCategoryInput {
    name: string
    image?: string
}

export interface CassandraUpdateCategoryData {
    image: string
}

export interface CassandraUpdateCategoryInput {
    categoryId: string
    updateCategoryData: CassandraUpdateCategoryData
}

export type FCassandraCategoriesByPostCreate = (
    params: ICassandraCategoriesByPost,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraPost>

export type FCassandraCategoriesByPostDelete = (
    params: ICassandraCategoriesByPost,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<boolean>

export type FCassandraCategoriesByPostGet = (
    params: CassandraPostKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraPost>

export type FCassandraCategoriesGet = (
    params: CassandraCategoryKey[],
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory[]>

export type FCassandraCategoryCreate = (
    params: CassandraCategoryInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>

export type FCassandraCategoryDelete = (
    params: CassandraCategoryKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>

export type FCassandraCategoryGet = (
    params: CassandraCategoryKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>

export type FCassandraCategoryUpdate = (
    params: CassandraUpdateCategoryInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<CassandraCategory>
