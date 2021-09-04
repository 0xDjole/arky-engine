import {
    EElasticSearchIndex,
    FElasticSearchPostDelete,
    withHandleAsync
} from 'services'

const elasticSearchPostDelete: FElasticSearchPostDelete = async (
    { id },
    { elasticSearchClient, error, handleAsync }
): Promise<void> => {
    const [clientDeleteError] = await handleAsync(
        elasticSearchClient.delete({
            index: EElasticSearchIndex.POSTS,
            id
        })
    )

    if (clientDeleteError) throw error(clientDeleteError)
}

export default withHandleAsync(elasticSearchPostDelete)
