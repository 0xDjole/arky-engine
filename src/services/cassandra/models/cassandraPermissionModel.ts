import { types as CassandraTypes } from 'cassandra-driver'
import {
    CassandraPermission,
    CassandraPermissionKeyData,
    CassandraPermissionPreModel,
    categoryFromItem,
    getTypeData
} from 'services'

export const toPermissionId = (
    permissionKey: CassandraPermissionKeyData
): string =>
    `PERMISSION#${permissionKey.categoryName.toLowerCase()}#${permissionKey.feature.toLowerCase()}#${permissionKey.action.toLowerCase()}`

export const cassandraPermissionModel = (
    permission: CassandraPermissionPreModel
): CassandraPermission => ({
    id: toPermissionId({
        categoryName: permission.category.name,
        feature: permission.feature,
        action: permission.action
    }),
    categoryName: permission.category.name,
    category: permission.category,
    feature: permission.feature,
    action: permission.action
})

export const permissionFromItem = (
    item: CassandraTypes.Row
): CassandraPermission => {
    const parsedItem = getTypeData(item, 'permission')
    const permission = cassandraPermissionModel({
        category: categoryFromItem(parsedItem) || null,
        feature: parsedItem.feature,
        action: parsedItem.action
    })

    return permission
}
