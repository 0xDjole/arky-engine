import {
    EElasticSearchIndex,
    FElasticSearchUserUpsert,
    withHandleAsync
} from 'services'

const elasticSearchUserUpsert: FElasticSearchUserUpsert = async (
    { user },
    { elasticSearchClient, error, handleAsync }
) => {
    const [clientUpdateError] = await handleAsync(
        elasticSearchClient.update({
            index: EElasticSearchIndex.USERS,
            id: user.id,
            body: {
                doc_as_upsert: true,
                doc: user
            }
        })
    )

    if (clientUpdateError) throw error(clientUpdateError)
}

export default withHandleAsync(elasticSearchUserUpsert)
