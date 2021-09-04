import { IAppSyncInput } from 'appSyncApi'
import {
    ICoreCategoriesGetFilteredInput,
    ICoreCategory,
    ICoreCategoryInput,
    ICoreCategoryKey,
    ICoreCategoryUpdateInput
} from 'services'

export type FAppSyncCategoryCreate = (
    event: IAppSyncInput<ICoreCategoryInput>
) => Promise<ICoreCategory>

export type FAppSyncCategoryDelete = (
    event: IAppSyncInput<ICoreCategoryKey>
) => Promise<ICoreCategory>

export type FAppSyncCategoryGet = (
    event: IAppSyncInput<ICoreCategoryKey>
) => Promise<ICoreCategory>

export type FAppSyncCategoriesGetFiltered = (
    event: IAppSyncInput<ICoreCategoriesGetFilteredInput>
) => Promise<ICoreCategory[]>

export type FAppSyncCategoryUpdate = (
    event: IAppSyncInput<ICoreCategoryUpdateInput>
) => Promise<ICoreCategory>
