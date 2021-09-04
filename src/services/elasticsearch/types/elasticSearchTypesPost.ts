import {
    IElasticSearchCategory,
    IServiceContext,
    IServiceContextReused
} from 'services'

export interface IElasticSearchLocation {
    lat: number
    lon: number
}
export interface IElasticSearchPostKeyData {
    name: string
    location: IElasticSearchLocation
}

export interface IElasticSearchPostInput extends IElasticSearchPostKeyData {
    image?: string
    address?: string
    city?: string
    country?: string
    categoryNames?: string[]
}

export interface IElasticSearchPostPreModel extends IElasticSearchPostKeyData {
    id?: string
    image?: string
    address?: string
    city?: string
    country?: string
    createdAt?: Date
}

export interface IElasticSearchPostConnections {
    categories?: IElasticSearchCategory[]
}

export interface IElasticSearchPost
    extends IElasticSearchPostPreModel,
        IElasticSearchPostConnections {
    id: string
    createdAt: Date
}

export interface IElasticSearchPostGetRandomInput {
    location: IElasticSearchLocation
    distance: number
    categoryNames: string[]
    matchAllCategories: boolean
}

export interface IElasticSearchPostUpsertInput {
    id: string
    post: IElasticSearchPost
}

export interface IElasticSearchPostCategoryCreateInput {
    id: string
    category: IElasticSearchCategory
}

export interface IElasticSearchDeletePostCategoryInput {
    id: string
    categoryName: string
}

export interface IElasticSearchDeletePostInput {
    id: string
}

export type FElasticSearchPostCategoryCreate = (
    params: IElasticSearchPostCategoryCreateInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchPostCategoryDelete = (
    params: IElasticSearchDeletePostCategoryInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchPostDelete = (
    params: IElasticSearchDeletePostInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>

export type FElasticSearchPostGetRandom = (
    params: IElasticSearchPostGetRandomInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<IElasticSearchPost>

export type FElasticSearchPostUpsert = (
    params: IElasticSearchPostUpsertInput,
    contextReused: IServiceContextReused,
    context: IServiceContext
) => Promise<void>
