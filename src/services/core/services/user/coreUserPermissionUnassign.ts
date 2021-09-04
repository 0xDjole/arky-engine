import { FCoreUserPermissionUnassign, withHandleAsync } from 'services'

const coreUserPermissionUnassign: FCoreUserPermissionUnassign = async (
    params,
    { error, errorMessages, handleAsync, logger },
    { language, user }
) => {
    return true
}

export default withHandleAsync(coreUserPermissionUnassign)
