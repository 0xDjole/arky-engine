import {
    FCassandraPermissionsByCategoryDelete,
    withHandleAsync
} from 'services'

const cassandraPermissionsByCategoryDelete: FCassandraPermissionsByCategoryDelete = async (
    category,
    { cassandraClient, error, errorMessages },
    { language }
) => {
    const [permissionsByCategoryDelete] = await cassandraClient.handleExecute(
        `DELETE FROM permissions_by_category WHERE category_id = ?;`,
        [category.id],
        {
            prepare: true
        }
    )

    if (permissionsByCategoryDelete)
        throw error({
            message: errorMessages[language].FAILED_TO_CREATE_POST_CATEGORIES
        })

    return category
}

export default withHandleAsync(cassandraPermissionsByCategoryDelete)
