import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core'
import config from 'config'

import ServerStack from './serverStack'

export default class ServerApp extends Stage {
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

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props)
        const serverStack = new ServerStack(
            this,
            `${config.APP_NAME}-ServerStack`
        )

        this.APP_NAME = serverStack.APP_NAME

        this.APP_STAGE = serverStack.APP_STAGE

        this.AWS_REGION = serverStack.AWS_REGION

        this.AWS_ACCOUNT_ID = serverStack.AWS_ACCOUNT_ID

        this.APPSYNC_API_URL = serverStack.APPSYNC_API_URL

        this.APPSYNC_API_KEY = serverStack.APPSYNC_API_KEY

        this.APPSYNC_REGION = serverStack.APPSYNC_REGION

        this.S3_URL = serverStack.S3_URL

        this.GOOGLE_CLIENT_ID = serverStack.GOOGLE_CLIENT_ID

        this.GOOGLE_CLIENT_SECRET = serverStack.GOOGLE_CLIENT_SECRET

        this.GOOGLE_AUTHORIZED_ORIGIN_URIS =
            serverStack.GOOGLE_AUTHORIZED_ORIGIN_URIS

        this.GOOGLE_AUTHORIZED_REDIRECT_URIS =
            serverStack.GOOGLE_AUTHORIZED_REDIRECT_URIS

        this.GOOGLE_RESPONSE_TYPE = serverStack.GOOGLE_RESPONSE_TYPE

        this.ELASTIC_SEARCH_ENDPOINT = serverStack.ELASTIC_SEARCH_ENDPOINT

        this.ELASTIC_SEARCH_PASSWORD = serverStack.ELASTIC_SEARCH_PASSWORD

        this.ELASTIC_SEARCH_USERNAME = serverStack.ELASTIC_SEARCH_USERNAME

        this.OWNER_NAME = serverStack.OWNER_NAME

        this.OWNER_EMAIL = serverStack.OWNER_EMAIL

        this.OWNER_PASSWORD = serverStack.OWNER_PASSWORD

        this.OWNER_IMAGE = serverStack.OWNER_IMAGE
    }
}
