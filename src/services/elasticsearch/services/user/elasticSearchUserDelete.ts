import {
    EElasticSearchIndex,
    FElasticSearchUserDelete,
    withHandleAsync
} from 'services'

const elasticSearchUserDelete: FElasticSearchUserDelete = async (
    { id },
    { elasticSearchClient, error, handleAsync }
) => {
    const [clientDeleteError] = await handleAsync(
        elasticSearchClient.delete({
            index: EElasticSearchIndex.USERS,
            id
        })
    )

    if (clientDeleteError) throw error(clientDeleteError)
}

export default withHandleAsync(elasticSearchUserDelete)
