export interface IElasticSearchPermissionKey {
    id: string
}

export interface IElasticSearchPermissionKeyData {
    feature: string
    action: string
    categoryName: string
}

export interface IElasticSearchPermissionPreModel {
    id?: string
    feature?: string
    action?: string
    categoryName?: string
}

export interface IElasticSearchPermission
    extends IElasticSearchPermissionPreModel {
    id: string
    feature: string
    action: string
    categoryName: string
}
