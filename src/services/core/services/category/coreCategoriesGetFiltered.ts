import {
    cassandraUserAuthorization,
    elasticSearchCategoriesGet,
    FCoreCategoriesGetFiltered,
    ICoreCategoriesGetFilteredInput,
    withHandleAsync
} from 'services'

const coreCategoriesGetFiltered: FCoreCategoriesGetFiltered = async (
    params,
    { elasticSearchClient, error, errorMessages, handleAsync, logger },
    { language }
) => {
    const [
        getFilteredCategoriesError,
        getFilteredCategoriesData
    ] = await elasticSearchCategoriesGet(
        params,
        { elasticSearchClient, error, errorMessages, handleAsync },
        { language }
    )

    if (getFilteredCategoriesError)
        throw error({
            name: getFilteredCategoriesError.name,
            message: getFilteredCategoriesError.message,
            logger
        })

    logger.info(getFilteredCategoriesData)
    return getFilteredCategoriesData
}

const validator = async (params: ICoreCategoriesGetFilteredInput) => ({
    categoryIds: params.categoryIds,
    action: 'GET',
    feature: 'CATEGORY',
    matchAllPermissions: true
})

export default withHandleAsync(
    cassandraUserAuthorization(coreCategoriesGetFiltered, validator)
)
