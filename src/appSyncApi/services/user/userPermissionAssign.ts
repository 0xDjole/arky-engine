import { FAppSyncUserPermissionAssign } from 'appSyncApi'
import {
    coreUserPermissionAssign,
    error,
    errorMessages,
    getLanguage,
    handleAsync,
    initCassandraClient,
    initLogger
} from 'services'

const contextReused = () => ({
    logger: initLogger(),
    cassandraClient: initCassandraClient(),
    error,
    errorMessages,
    handleAsync
})

const handler: FAppSyncUserPermissionAssign = async event => {
    const context = await contextReused()
    try {
        const { payload } = event.arguments

        const [
            deleteUserServiceError,
            deleteUserServiceData
        ] = await coreUserPermissionAssign(
            {
                email: payload.email,
                permissionIds: payload.permissionIds
            },
            context,
            {
                language: getLanguage(event)
            }
        )

        if (deleteUserServiceError) throw error(deleteUserServiceError)

        return deleteUserServiceData
    } finally {
        context.cassandraClient.shutdown()
    }
}

export { handler }
