import {
    ElasticSearchPage,
    IElasticSearchPermission,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface IElasticSearchCategoryKey {
    name: string
}

export interface IElasticSearchCategoryInput extends IElasticSearchCategoryKey {
    image?: string
}

export interface IElasticSearchCategoryPreModel
    extends IElasticSearchCategoryInput {
    id?: string
    createdAt?: Date
}

export interface IElasticSearchCategory extends IElasticSearchCategoryPreModel {
    id: string
    createdAt: Date
}

export interface IElasticSearchCategoriesGetInput {
    longitude: number
    latitude: number
    distance: number
    categoryIds: string[]
}

export interface IElasticSearchUpsertCategoryInput {
    id: string
    category: IElasticSearchCategory
}

export interface IElasticSearchDeleteCategoryInput {
    id: string
}

export interface IElasticSearchCategoryPermissionCreateInput {
    id: string
    permission: IElasticSearchPermission
}

export interface IElasticSearchCategoryPermissionDeleteInput {
    id: string
    permission: IElasticSearchPermission
}

export type FElasticSearchCategoriesGet = (
    params: IElasticSearchCategoriesGetInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<ElasticSearchPage<IElasticSearchCategory>>

export type FElasticSearchCategoryDelete = (
    params: IElasticSearchDeleteCategoryInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchCategoryPermissionCreate = (
    params: IElasticSearchCategoryPermissionCreateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchCategoryPermissionDelete = (
    params: IElasticSearchCategoryPermissionDeleteInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchCategoryUpsert = (
    params: IElasticSearchUpsertCategoryInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>
