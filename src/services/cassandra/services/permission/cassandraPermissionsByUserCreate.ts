import { types as cassandraTypes } from 'cassandra-driver'
import moment from 'moment'
import {
    cassandraPermissionsByUserGet,
    cassandraUserByTokenCreate,
    FCassandraPermissionsByUserCreate,
    withHandleAsync
} from 'services'

const cassandraPermissionsByUserCreate: FCassandraPermissionsByUserCreate = async (
    { user, permissions },
    { cassandraClient, error, errorMessages, handleAsync },
    { language, user: authUser }
) => {
    const minuteUuid = cassandraTypes.TimeUuid.fromDate(
        moment().startOf('minute').toDate()
    ).toString()

    const [
        cassandraPermissionsUserGetError,
        cassandraPermissionsUserGetData
    ] = await cassandraPermissionsByUserGet(
        {
            id: user.id
        },
        { cassandraClient, error, errorMessages, handleAsync },
        { language }
    )

    if (cassandraPermissionsUserGetError)
        throw error(cassandraPermissionsUserGetError)

    const oldPermissionIds = cassandraPermissionsUserGetData.permissions.map(
        permissionItem => permissionItem.id
    )

    const newPermissions = permissions.filter(
        permissionItem => !oldPermissionIds.includes(permissionItem.id)
    )

    const permissionUserDataCreate = newPermissions.map(permissionItem => ({
        query: `INSERT INTO permission_user_lookup (
            user_id,
            permission_id,
            minute_id
        ) VALUES (?, ?, ?);`,
        params: [user.id, permissionItem.id, minuteUuid]
    }))

    const permissionMinutesByUserDataCreate = {
        query: `INSERT INTO permission_minutes_by_user (
            user_id,
            minute_id
        ) VALUES (?, ?);`,
        params: [user.id, minuteUuid]
    }

    const userMinutesByPermissionsDataCreate = newPermissions.map(
        permissionItem => ({
            query: `INSERT INTO user_minutes_by_permission (
            permission_id,
            minute_id
        ) VALUES (?, ?);`,
            params: [permissionItem.id, minuteUuid]
        })
    )

    const permissionsByUserDataCreate = newPermissions.map(permissionItem => ({
        query: `INSERT INTO permissions_by_user (
            user_id,
            user_email,
            user_name, 
            user_image, 
            user_created_at,
            permission_category_id,
            permission_category_name, 
            permission_category_image, 
            permission_category_created_at,
            permission_id,
            permission_feature,
            permission_action,
            minute_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        params: [
            user.id,
            user.email,
            user.name,
            user.image,
            user.createdAt,
            permissionItem.category.id,
            permissionItem.category.name,
            permissionItem.category.image,
            permissionItem.category.createdAt,
            permissionItem.id,
            permissionItem.feature,
            permissionItem.action,
            minuteUuid
        ]
    }))

    const usersByPermissionsDataCreate = newPermissions.map(permissionItem => ({
        query: `INSERT INTO users_by_permission (
            permission_id,
            permission_feature,
            permission_action,
            permission_category_id,
            permission_category_name, 
            permission_category_image, 
            permission_category_created_at,
            user_id,
            user_email,
            user_name, 
            user_image, 
            user_created_at,
            minute_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        params: [
            permissionItem.id,
            permissionItem.feature,
            permissionItem.action,
            permissionItem.category.id,
            permissionItem.category.name,
            permissionItem.category.image,
            permissionItem.category.createdAt,
            user.id,
            user.email,
            user.name,
            user.image,
            user.createdAt,
            minuteUuid
        ]
    }))

    const [permissionsByUserCreateError] = await cassandraClient.handleBatch(
        [
            ...permissionsByUserDataCreate,
            ...permissionUserDataCreate,
            ...usersByPermissionsDataCreate,
            ...userMinutesByPermissionsDataCreate,
            permissionMinutesByUserDataCreate
        ],
        {
            prepare: true,
            logged: false
        }
    )

    if (permissionsByUserCreateError)
        throw error({
            message: errorMessages[language].FAILED_TO_CREATE_USER_PERMISSIONS
        })

    if (authUser) {
        const [
            cassandraUserByTokenCreateError
        ] = await cassandraUserByTokenCreate(
            {
                user: {
                    ...authUser,
                    permissions
                },
                token: authUser.token
            },
            { cassandraClient, error, errorMessages, handleAsync },
            { language }
        )

        if (cassandraUserByTokenCreateError)
            throw error(cassandraUserByTokenCreateError)
    }

    return {
        ...user,
        permissions
    }
}

export default withHandleAsync(cassandraPermissionsByUserCreate)
