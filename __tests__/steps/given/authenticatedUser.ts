/* eslint-disable import/no-cycle */
import { signUp } from 'apiCall/utils'
import { error, handleAsync } from 'services'

import randomUser from './randomUser'

const authenticatedUser = async (): Promise<any> => {
    const { id, name, email, password, image } = randomUser()

    const [signUpError, signUpData] = await handleAsync(
        signUp({
            id,
            email,
            name,
            password,
            image
        })
    )

    if (signUpError) throw error(signUpError)

    return {
        ...signUpData
    }
}

export default authenticatedUser
