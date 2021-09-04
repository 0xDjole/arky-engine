import { LambdaDataSource } from '@aws-cdk/aws-appsync'
import { Function } from '@aws-cdk/aws-lambda'

export type Lambdas = {
    getMe: Function
    getUser: Function
    assignPermission: Function
    unassignPermission: Function
    updateUser: Function
    deleteUser: Function
    getCategory: Function
    getFilteredCategories: Function
    createCategory: Function
    updateCategory: Function
    deleteCategory: Function
    getPost: Function
    getFilteredPosts: Function
    getRandomPost: Function
    createPost: Function
    updatePost: Function
    deletePost: Function
    syncElasticSearch: Function
}

export type LambdaDataSources = Record<string, LambdaDataSource>
