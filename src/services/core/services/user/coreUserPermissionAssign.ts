import { FCoreUserPermissionAssign, withHandleAsync } from 'services'

const coreUserPermissionAssign: FCoreUserPermissionAssign = async (
    params,
    { errorMessages, error, handleAsync, logger },
    { language, user }
) => {
    return true
}

export default withHandleAsync(coreUserPermissionAssign)
