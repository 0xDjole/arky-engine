import {
    ICorePermission,
    IElasticSearchPermission,
    toPermissionId
} from 'services'

export const permissionToDoc = (
    permission: ICorePermission
): IElasticSearchPermission => {
    const permissionModelData: IElasticSearchPermission = {
        id: toPermissionId(permission),
        feature: permission.feature,
        action: permission.action,
        categoryName: permission.categoryName
    }

    return permissionModelData
}
