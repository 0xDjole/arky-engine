import * as when from 'apiCall'
import { error, handleAsync, ISignedUpUser, toUserId } from 'services'

import * as given from '../../steps/given'

describe('Update user', () => {
    let newUser: ISignedUpUser

    beforeAll(async () => {
        const [
            authenticatedUserError,
            authenticatedUserData
        ] = await handleAsync(given.authenticatedUser())

        if (authenticatedUserError) throw error(authenticatedUserError)

        newUser = authenticatedUserData
    })

    afterAll(async () => {
        await when.weInvokeDeleteUser({
            payload: { id: toUserId(newUser) }
        })
    })

    test('Should update user fields', async () => {
        const newUserData = given.randomUser()

        const [udateUserError, updatedUserData] = await handleAsync(
            when.aUserCallsUpdateUser(
                {
                    payload: {
                        userKeyData: {
                            id: newUser.id
                        },
                        updateUserData: {
                            name: newUserData.name,
                            image: newUserData.image
                        }
                    }
                },
                newUser.openIdToken
            )
        )

        if (udateUserError) throw error(udateUserError)

        expect(updatedUserData).toMatchObject({
            name: newUserData.name,
            image: newUserData.image,
            email: newUser.email
        })
    })
})
