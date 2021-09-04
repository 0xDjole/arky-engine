import * as when from 'apiCall'
import _ from 'lodash'
import {
    cassandraPermissionsByUserCreate,
    cassandraUserCreate,
    elasticSearchUserUpsert,
    error,
    errorMessages,
    handleAsync,
    initCassandraClient,
    initElasticSearch
} from 'services'

export const up = async (): Promise<boolean> => {
    const cassandraClient = initCassandraClient()
    const elasticSearchClient = initElasticSearch()
    try {
        const [importCategoriesError, importCategoriesData] = await handleAsync(
            when.weInvokeImportCategories([
                {
                    name: 'public',
                    image: `${process.env.S3_URL}/icons/bar.png`
                },
                {
                    name: 'category',
                    image: `${process.env.S3_URL}/icons/bar.png`
                },
                {
                    name: 'owner',
                    image: `${process.env.S3_URL}/icons/bar.png`
                }
            ])
        )

        if (importCategoriesError) throw error(importCategoriesError)

        const [
            cassandraUserCreateError,
            cassandraUserCreateData
        ] = await cassandraUserCreate(
            {
                email: process.env.OWNER_EMAIL,
                name: process.env.OWNER_NAME,
                image: ''
            },
            { cassandraClient, error, errorMessages, handleAsync },
            { language: 'en-US' }
        )

        if (cassandraUserCreateError) throw error(cassandraUserCreateError)

        const [
            cassandraPermissionsByUserCreateError,
            cassandraPermissionsByUserCreateData
        ] = await cassandraPermissionsByUserCreate(
            {
                user: cassandraUserCreateData,
                permissions: _.flatten(
                    importCategoriesData.map(category => category.permissions)
                )
            },
            { cassandraClient, error, errorMessages, handleAsync },
            { language: 'en-US' }
        )

        if (cassandraPermissionsByUserCreateError)
            throw error(cassandraPermissionsByUserCreateError)

        const [elasticSearchUserUpsertError] = await elasticSearchUserUpsert(
            { user: cassandraPermissionsByUserCreateData },
            { elasticSearchClient, error, handleAsync },
            { language: 'en-US' }
        )

        if (elasticSearchUserUpsertError)
            throw error(elasticSearchUserUpsertError)

        cassandraClient.shutdown()
        return true
    } catch ({ message }) {
        cassandraClient.shutdown()
        return false
    }
}

export const down = (): boolean => {
    return true
}
