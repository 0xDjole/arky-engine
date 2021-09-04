import 'source-map-support/register'

import { AuthorizationType, GraphqlApi, Schema } from '@aws-cdk/aws-appsync'
import { Policy, PolicyStatement } from '@aws-cdk/aws-iam'
import { Code, Function, LayerVersion, Runtime } from '@aws-cdk/aws-lambda'
import { Bucket, BucketEncryption, HttpMethods } from '@aws-cdk/aws-s3'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import { Secret } from '@aws-cdk/aws-secretsmanager'
import { StringParameter } from '@aws-cdk/aws-ssm'
import {
    CfnOutput,
    Duration,
    Expiration,
    RemovalPolicy,
    SecretValue,
    Stack,
    StackProps,
    Stage
} from '@aws-cdk/core'
import config, * as envEnum from 'config'
import { LambdaDataSources } from 'infrastructure'
import { error } from 'services'

// Create stack
export default class ServerStack extends Stack {
    public APP_NAME: CfnOutput

    public APP_STAGE: CfnOutput

    public AWS_REGION: CfnOutput

    public AWS_ACCOUNT_ID: CfnOutput

    public APPSYNC_API_URL: CfnOutput

    public APPSYNC_API_KEY: CfnOutput

    public APPSYNC_REGION: CfnOutput

    public S3_URL: CfnOutput

    public GOOGLE_CLIENT_ID: CfnOutput

    public GOOGLE_CLIENT_SECRET: CfnOutput

    public GOOGLE_AUTHORIZED_ORIGIN_URIS: CfnOutput

    public GOOGLE_AUTHORIZED_REDIRECT_URIS: CfnOutput

    public GOOGLE_RESPONSE_TYPE: CfnOutput

    public ELASTIC_SEARCH_ENDPOINT: CfnOutput

    public ELASTIC_SEARCH_PASSWORD: CfnOutput

    public ELASTIC_SEARCH_USERNAME: CfnOutput

    public OWNER_NAME: CfnOutput

    public OWNER_EMAIL: CfnOutput

    public OWNER_PASSWORD: CfnOutput

    public OWNER_IMAGE: CfnOutput

    public KAFKA_CLUSTER_ID: CfnOutput

    public KAFKA_BROKERS: CfnOutput

    public KAFKA_SECRET: CfnOutput

    public CASSANDRA_KEYSPACE: CfnOutput

    public CASSANDRA_USERNAME: CfnOutput

    public CASSANDRA_PASSWORD: CfnOutput

    constructor(scope: Stage, id: string, props?: StackProps) {
        super(scope, id, props)
        if (!config.APP_NAME)
            throw error({
                message: 'No app name provided'
            })

        const ParamsPath = `/${config.APP_NAME}/${scope.stageName}`

        const GOOGLE_AUTHORIZED_ORIGIN_URIS_PARAM = [
            'http://localhost:3000',
            'https://tox.arky.io'
        ]

        const GOOGLE_AUTHORIZED_REDIRECT_URIS_PARAM = [
            'http://localhost:3000/google/callback',
            'https://tox.arky.io/google/callback'
        ]

        const KAFKA_BROKERS_PARAM = [
            'pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092'
        ]

        const GOOGLE_RESPONSE_TYPE_PARAM = 'code'

        const GOOGLE_CLIENT_ID_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.GOOGLE_CLIENT_ID}`
        )

        const GOOGLE_CLIENT_SECRET_SECRET = Secret.fromSecretNameV2(
            this,
            `${ParamsPath}/${envEnum.GOOGLE_CLIENT_SECRET}-PreExisting`,
            `${ParamsPath}/${envEnum.GOOGLE_CLIENT_SECRET}`
        )

        const ELASTIC_SEARCH_ENDPOINT_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.ELASTIC_SEARCH_ENDPOINT}`
        )

        const ELASTIC_SEARCH_USERNAME_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.ELASTIC_SEARCH_USERNAME}`
        )

        const ELASTIC_SEARCH_PASSWORD_SECRET = Secret.fromSecretNameV2(
            this,
            `${ParamsPath}/${envEnum.ELASTIC_SEARCH_PASSWORD}/PreExisting`,
            `${ParamsPath}/${envEnum.ELASTIC_SEARCH_PASSWORD}`
        )

        const OWNER_NAME_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.OWNER_NAME}`
        )

        const OWNER_EMAIL_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.OWNER_EMAIL}`
        )

        const OWNER_IMAGE_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.OWNER_IMAGE}`
        )

        const OWNER_PASSWORD_SECRET = Secret.fromSecretNameV2(
            this,
            `${ParamsPath}/${envEnum.OWNER_PASSWORD}-PreExisting`,
            `${ParamsPath}/${envEnum.OWNER_PASSWORD}`
        )

        const KAFKA_CLUSTER_ID_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.KAFKA_CLUSTER_ID}`
        )

        const KAFKA_SECRET_SECRET = Secret.fromSecretNameV2(
            this,
            `${ParamsPath}/${envEnum.KAFKA_SECRET}-PreExisting`,
            `${ParamsPath}/${envEnum.KAFKA_SECRET}`
        )

        const CASSANDRA_KEYSPACE_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.CASSANDRA_KEYSPACE}`
        )

        const CASSANDRA_USERNAME_PARAM = StringParameter.valueForStringParameter(
            this,
            `${ParamsPath}/${envEnum.CASSANDRA_USERNAME}`
        )

        const CASSANDRA_PASSWORD_SECRET = Secret.fromSecretNameV2(
            this,
            `${ParamsPath}/${envEnum.CASSANDRA_PASSWORD}-PreExisting`,
            `${ParamsPath}/${envEnum.CASSANDRA_PASSWORD}`
        )

        const bucketName = `${scope.stageName}-${config.APP_NAME}-Assets-Bucket`

        const assetsBucket = new Bucket(this, bucketName, {
            bucketName: bucketName.toLowerCase(),
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            encryption: BucketEncryption.UNENCRYPTED,
            cors: [
                {
                    allowedMethods: [HttpMethods.GET],
                    allowedOrigins: [
                        'http://localhost:3000',
                        'https://tox.arky.io'
                    ]
                }
            ]
        })

        new BucketDeployment(
            this,
            `${scope.stageName}-${config.APP_NAME}-Assets-Bucket-Icons`,
            {
                sources: [Source.asset(`${__dirname}/../../assets/icons`)],
                destinationBucket: assetsBucket,
                destinationKeyPrefix: 'icons/'
            }
        )

        const graphQLApi = new GraphqlApi(
            this,
            `${scope.stageName}-${config.APP_NAME}-Api`,
            {
                name: `${scope.stageName}-${config.APP_NAME}-Api`,
                schema: Schema.fromAsset(
                    `${__dirname}/../../appSyncApi/schema.graphql`
                ),
                authorizationConfig: {
                    defaultAuthorization: {
                        authorizationType: AuthorizationType.API_KEY,
                        apiKeyConfig: {
                            expires: Expiration.after(Duration.days(365))
                        }
                    }
                },

                xrayEnabled: true
            }
        )

        this.APP_NAME = new CfnOutput(this, envEnum.APP_NAME, {
            value: config.APP_NAME
        })

        this.APP_STAGE = new CfnOutput(this, envEnum.APP_STAGE, {
            value: scope.stageName
        })

        this.AWS_REGION = new CfnOutput(this, envEnum.AWS_REGION, {
            value: this.region
        })

        this.AWS_ACCOUNT_ID = new CfnOutput(this, envEnum.AWS_ACCOUNT_ID, {
            value: this.account
        })

        this.APPSYNC_API_URL = new CfnOutput(this, envEnum.APPSYNC_API_URL, {
            value: graphQLApi.graphqlUrl
        })

        this.APPSYNC_API_KEY = new CfnOutput(this, envEnum.APPSYNC_API_KEY, {
            value: graphQLApi.apiKey
        })

        this.APPSYNC_REGION = new CfnOutput(this, envEnum.APPSYNC_REGION, {
            value: graphQLApi.env.region
        })

        this.S3_URL = new CfnOutput(this, envEnum.S3_URL, {
            value: assetsBucket.bucketRegionalDomainName
        })

        this.GOOGLE_CLIENT_ID = new CfnOutput(this, envEnum.GOOGLE_CLIENT_ID, {
            value: GOOGLE_CLIENT_ID_PARAM
        })

        this.GOOGLE_CLIENT_SECRET = new CfnOutput(
            this,
            envEnum.GOOGLE_CLIENT_SECRET,
            { value: GOOGLE_CLIENT_SECRET_SECRET.secretValue.toString() }
        )

        this.GOOGLE_AUTHORIZED_ORIGIN_URIS = new CfnOutput(
            this,
            envEnum.GOOGLE_AUTHORIZED_ORIGIN_URIS,
            {
                value: JSON.stringify(GOOGLE_AUTHORIZED_ORIGIN_URIS_PARAM)
            }
        )

        this.GOOGLE_AUTHORIZED_REDIRECT_URIS = new CfnOutput(
            this,
            envEnum.GOOGLE_AUTHORIZED_REDIRECT_URIS,
            {
                value: JSON.stringify(GOOGLE_AUTHORIZED_REDIRECT_URIS_PARAM)
            }
        )

        this.GOOGLE_RESPONSE_TYPE = new CfnOutput(
            this,
            envEnum.GOOGLE_RESPONSE_TYPE,
            {
                value: JSON.stringify(GOOGLE_RESPONSE_TYPE_PARAM)
            }
        )

        this.ELASTIC_SEARCH_ENDPOINT = new CfnOutput(
            this,
            envEnum.ELASTIC_SEARCH_ENDPOINT,
            {
                value: ELASTIC_SEARCH_ENDPOINT_PARAM
            }
        )

        this.ELASTIC_SEARCH_USERNAME = new CfnOutput(
            this,
            envEnum.ELASTIC_SEARCH_USERNAME,
            {
                value: ELASTIC_SEARCH_USERNAME_PARAM
            }
        )

        this.ELASTIC_SEARCH_PASSWORD = new CfnOutput(
            this,
            envEnum.ELASTIC_SEARCH_PASSWORD,
            {
                value: ELASTIC_SEARCH_PASSWORD_SECRET.secretValue.toString()
            }
        )

        this.OWNER_NAME = new CfnOutput(this, envEnum.OWNER_NAME, {
            value: OWNER_NAME_PARAM
        })

        this.OWNER_EMAIL = new CfnOutput(this, envEnum.OWNER_EMAIL, {
            value: OWNER_EMAIL_PARAM
        })

        this.OWNER_IMAGE = new CfnOutput(this, envEnum.OWNER_IMAGE, {
            value: OWNER_IMAGE_PARAM
        })

        this.OWNER_PASSWORD = new CfnOutput(this, envEnum.OWNER_PASSWORD, {
            value: OWNER_PASSWORD_SECRET.secretValue.toString()
        })

        this.KAFKA_CLUSTER_ID = new CfnOutput(this, envEnum.KAFKA_CLUSTER_ID, {
            value: KAFKA_CLUSTER_ID_PARAM
        })

        this.KAFKA_BROKERS = new CfnOutput(this, envEnum.KAFKA_BROKERS, {
            value: JSON.stringify(KAFKA_BROKERS_PARAM)
        })

        this.KAFKA_SECRET = new CfnOutput(this, envEnum.KAFKA_SECRET, {
            value: KAFKA_SECRET_SECRET.secretValue.toString()
        })

        this.CASSANDRA_KEYSPACE = new CfnOutput(
            this,
            envEnum.CASSANDRA_KEYSPACE,
            {
                value: CASSANDRA_KEYSPACE_PARAM
            }
        )

        this.CASSANDRA_USERNAME = new CfnOutput(
            this,
            envEnum.CASSANDRA_USERNAME,
            {
                value: CASSANDRA_USERNAME_PARAM
            }
        )
        this.CASSANDRA_PASSWORD = new CfnOutput(
            this,
            envEnum.CASSANDRA_PASSWORD,
            {
                value: CASSANDRA_PASSWORD_SECRET.secretValue.toString()
            }
        )

        const environment = {
            APP_NAME: config.APP_NAME,
            APP_STAGE: scope.stageName,
            GOOGLE_AUTHORIZED_ORIGIN_URIS: JSON.stringify(
                GOOGLE_AUTHORIZED_ORIGIN_URIS_PARAM
            ),
            GOOGLE_AUTHORIZED_REDIRECT_URIS: JSON.stringify(
                GOOGLE_AUTHORIZED_REDIRECT_URIS_PARAM
            ),
            GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID_PARAM,
            GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET_SECRET.secretValue.toString(),
            ELASTIC_SEARCH_PASSWORD: ELASTIC_SEARCH_PASSWORD_SECRET.secretValue.toString(),
            ELASTIC_SEARCH_ENDPOINT: ELASTIC_SEARCH_ENDPOINT_PARAM,
            ELASTIC_SEARCH_USERNAME: ELASTIC_SEARCH_USERNAME_PARAM,
            KAFKA_CLUSTER_ID: KAFKA_CLUSTER_ID_PARAM,
            KAFKA_BROKERS: JSON.stringify(KAFKA_BROKERS_PARAM),
            KAFKA_SECRET: KAFKA_SECRET_SECRET.secretValue.toString(),
            CASSANDRA_KEYSPACE: CASSANDRA_KEYSPACE_PARAM,
            CASSANDRA_USERNAME: CASSANDRA_USERNAME_PARAM,
            CASSANDRA_PASSWORD: CASSANDRA_PASSWORD_SECRET.secretValue.toString()
        }

        const nodeModulesLayer = new LayerVersion(
            this,
            `${scope.stageName}-${config.APP_NAME}-NodeModulesLayer`,
            {
                compatibleRuntimes: [Runtime.NODEJS_12_X],
                code: Code.fromAsset(`${__dirname}/../../nodeModules`)
            }
        )
        const servicesLayer = new LayerVersion(
            this,
            `${scope.stageName}-${config.APP_NAME}-ServicesLayer`,
            {
                compatibleRuntimes: [Runtime.NODEJS_12_X],
                code: Code.fromAsset(`${__dirname}/../../services`)
            }
        )

        const layers = [nodeModulesLayer, servicesLayer]

        const userDelete = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userDelete`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userDeleteHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userGet = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userGet`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userGetHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userGetMe = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userGetMe`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userGetMeHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userPermissionAssign = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userPermissionAssign`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userPermissionAssignHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userPermissionUnassign = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userPermissionUnassign`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userPermissionUnassignHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userOAuth2Login = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userOAuth2Login`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userOAuth2LoginHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userOAuth2LoginUrlGet = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userOAuth2LoginUrlGet`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userOAuth2LoginUrlGetHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userOAuth2Logout = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userOAuth2Logout`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userOAuth2LogoutHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userOAuth2RefreshAccessToken = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userOAuth2RefreshAccessToken`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userOAuth2RefreshAccessTokenHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const userUpdate = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-userUpdate`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.userUpdateHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/user`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )

        const categoryCreate = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-categoryCreate`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.categoryCreateHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/category`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const categoryDelete = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-categoryDelete`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.categoryDeleteHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/category`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const categoryGet = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-categoryGet`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.categoryGetHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/category`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const categoriesGetFiltered = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-categoriesGetFiltered`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.categoriesGetFilteredHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/category`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const categoryUpdate = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-categoryUpdate`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.categoryUpdateHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/category`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )

        const postCreate = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-postCreate`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.postCreateHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/post`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const postDelete = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-postDelete`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.postDeleteHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/post`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const postGet = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-postGet`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.postGetHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/post`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const postsGetFiltered = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-postsGetFiltered`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.postsGetFilteredHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/post`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const postGetRandom = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-postGetRandom`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.postGetRandomHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/post`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const postUpdate = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-postUpdate`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.postUpdateHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/post`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )
        const syncElasticSearch = new Function(
            this,
            `${scope.stageName}-${config.APP_NAME}-syncElasticSearch`,
            {
                runtime: Runtime.NODEJS_12_X,
                handler: 'index.syncElasticSearchHandler',
                code: Code.fromAsset(
                    `${__dirname}/../../appSyncApi/services/post`
                ),
                memorySize: 1024,
                environment,
                layers
            }
        )

        const lambdas: { [key: string]: Function } = {
            userDelete,
            userGet,
            userGetMe,
            userPermissionAssign,
            userPermissionUnassign,
            userOAuth2Login,
            userOAuth2LoginUrlGet,
            userOAuth2Logout,
            userOAuth2RefreshAccessToken,
            userUpdate,
            categoryCreate,
            categoryDelete,
            categoryGet,
            categoriesGetFiltered,
            categoryUpdate,
            postCreate,
            postDelete,
            postGet,
            postsGetFiltered,
            postGetRandom,
            postUpdate,
            syncElasticSearch
        }

        const lambdaKeys: string[] = Object.keys(lambdas)
        lambdaKeys.map((lambdaKey: string): void => {
            const lambda = lambdas[lambdaKey]

            lambda.role?.attachInlinePolicy(
                new Policy(
                    this,
                    `${scope.stageName}-${config.APP_NAME}-Params-${lambdaKey}`,
                    {
                        statements: [
                            new PolicyStatement({
                                actions: [
                                    'ssm:GetParameters',
                                    'ssm:GetParameter'
                                ],
                                resources: [
                                    `arn:aws:ssm:${this.region}:${this.account}:parameter/${config.APP_NAME}/${scope.stageName}/*`
                                ]
                            })
                        ]
                    }
                )
            )

            return null
        })

        const lambdaDataSources: LambdaDataSources = {}

        lambdaKeys
            .filter(
                lambdaKey =>
                    !['updateUser', 'syncElasticSearch'].includes(lambdaKey)
            )
            .map((lambdaKey: string): void => {
                const dataSource = graphQLApi.addLambdaDataSource(
                    `${lambdaKey}DataSource`,
                    lambdas[lambdaKey]
                )

                lambdaDataSources[dataSource.name] = dataSource
                return null
            })

        lambdaDataSources.userDeleteDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'userDelete'
        })

        lambdaDataSources.userGetDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'userGet'
        })

        lambdaDataSources.userGetMeDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'userGetMe'
        })

        lambdaDataSources.userPermissionAssignDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'userPermissionAssign'
        })

        lambdaDataSources.userPermissionUnassignDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'userPermissionUnassign'
        })

        lambdaDataSources.userOAuth2LoginDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'userOAuth2Login'
        })

        lambdaDataSources.userOAuth2LoginUrlGetDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'userOAuth2LoginUrlGet'
        })

        lambdaDataSources.userOAuth2LogoutDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'userOAuth2Logout'
        })

        lambdaDataSources.userOAuth2RefreshAccessTokenDataSource.createResolver(
            {
                typeName: 'Mutation',
                fieldName: 'userOAuth2RefreshAccessToken'
            }
        )

        lambdaDataSources.categoryCreateDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'categoryCreate'
        })

        lambdaDataSources.categoryDeleteDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'categoryDelete'
        })

        lambdaDataSources.categoryGetDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'categoryGet'
        })

        lambdaDataSources.categoriesGetFilteredDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'categoriesGetFiltered'
        })

        lambdaDataSources.categoryUpdateDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'categoryUpdate'
        })

        lambdaDataSources.postCreateDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'postCreate'
        })

        lambdaDataSources.postDeleteDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'postDelete'
        })

        lambdaDataSources.postGetDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'postGet'
        })

        lambdaDataSources.postsGetFilteredDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'postsGetFiltered'
        })

        lambdaDataSources.postGetRandomDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'postGetRandom'
        })

        lambdaDataSources.postUpdateDataSource.createResolver({
            typeName: 'Mutation',
            fieldName: 'postUpdate'
        })
    }
}
