import {
    ICorePermission,
    ICorePost,
    IServiceContext,
    IServiceContextReused,
    TCorePage
} from 'services'

export interface ICoreCategoryConnections {
    permissions?: ICorePermission[]
}

export interface ICoreCategoriesGetFilteredInput {
    longitude: number
    latitude: number
    distance: number
    categoryIds: string[]
}

export interface ICoreCategoryKey {
    id: string
}

export interface ICoreCategoryKeyData {
    name: string
}

export interface ICoreCategoryPreModel extends ICoreCategoryKeyData {
    id?: string
    image?: string
    createdAt?: Date
}

export interface ICoreCategory
    extends ICoreCategoryPreModel,
        ICoreCategoryConnections {
    id: string
    createdAt: Date
}

export interface ICoreCategoryWithPosts extends ICoreCategory {
    posts: ICorePost[]
}

export interface ICoreCategoryInput {
    name: string
    image?: string
}

export interface ICoreCategoryUpdateData {
    image: string
}

export interface ICoreCategoryUpdateInput {
    categoryId: string
    updateCategoryData: ICoreCategoryUpdateData
}

export type FCoreCategoriesGetFiltered = (
    params: ICoreCategoriesGetFilteredInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<TCorePage<ICoreCategory>>

export type FCoreCategoryCreate = (
    params: ICoreCategoryInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreCategory>

export type FCoreCategoryDelete = (
    params: ICoreCategoryKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreCategory>

export type FCoreCategoryGet = (
    params: ICoreCategoryKey,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreCategory>

export type FCoreCategoryUpdate = (
    params: ICoreCategoryUpdateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ICoreCategory>
