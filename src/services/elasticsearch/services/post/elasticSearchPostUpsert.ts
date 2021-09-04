import {
    EElasticSearchIndex,
    FElasticSearchPostUpsert,
    handleAsync,
    withHandleAsync
} from 'services'

const elasticSearchPostUpsert: FElasticSearchPostUpsert = async (
    { id, post },
    { elasticSearchClient, error }
) => {
    const [clientDeleteError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.POSTS,
            id,
            body: {
                doc_as_upsert: true,
                doc: post
            }
        })
    )

    if (clientDeleteError) throw error(clientDeleteError)
}

export default withHandleAsync(elasticSearchPostUpsert)
