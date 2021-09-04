import { BuildEnvironmentVariableType } from '@aws-cdk/aws-codebuild'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions'
import { Effect, Policy, PolicyStatement } from '@aws-cdk/aws-iam'
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core'
import {
    CdkPipeline,
    ShellScriptAction,
    SimpleSynthAction
} from '@aws-cdk/pipelines'
import config, {
    ELASTIC_SEARCH_PASSWORD,
    GOOGLE_CLIENT_SECRET,
    OWNER_PASSWORD
} from 'config'

import ServerApp from './serverApp'

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const sourceArtifact = new codepipeline.Artifact()
        const cloudAssemblyArtifact = new codepipeline.Artifact()

        const pipeline = new CdkPipeline(this, `${config.APP_NAME}-Pipeline`, {
            pipelineName: `${config.APP_NAME}-Pipeline`,
            cloudAssemblyArtifact,
            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: SecretValue.secretsManager(
                    `/${config.APP_NAME}/GITHUB_TOKEN`
                ),
                trigger: codepipeline_actions.GitHubTrigger.POLL,
                // Replace these with your actual GitHub project info
                owner: 'arkyofficial',
                repo: 'tox-server',
                branch: 'main'
            }),
            synthAction: SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                buildCommand: 'npm run build'
            })
        })

        const prodStageName = 'Prod'

        const prodServer = new ServerApp(this, prodStageName, {
            env: {
                account: '128973290805',
                region: 'eu-central-1'
            }
        })

        const prodStage = pipeline.addApplicationStage(prodServer)

        // const prodTestAction = new ShellScriptAction({
        //     additionalArtifacts: [sourceArtifact],
        //     actionName: `${prodStageName}-${config.APP_NAME}-Action`,
        //     commands: ['npm install', 'npm run integration-test'],
        //     runOrder: prodStage.nextSequentialRunOrder(),
        //     environmentVariables: {
        //         ELASTIC_SEARCH_PASSWORD: {
        //             type: BuildEnvironmentVariableType.SECRETS_MANAGER,
        //             value: `/${config.APP_NAME}/${prodStageName}/${ELASTIC_SEARCH_PASSWORD}`
        //         },
        //         OWNER_PASSWORD: {
        //             type: BuildEnvironmentVariableType.SECRETS_MANAGER,
        //             value: `/${config.APP_NAME}/${prodStageName}/${OWNER_PASSWORD}`
        //         },
        //         GOOGLE_CLIENT_SECRET: {
        //             type: BuildEnvironmentVariableType.SECRETS_MANAGER,
        //             value: `/${config.APP_NAME}/${prodStageName}/${GOOGLE_CLIENT_SECRET}`
        //         }
        //     },
        //     useOutputs: {
        //         APP_NAME: pipeline.stackOutput(prodServer.APP_NAME),
        //         APP_STAGE: pipeline.stackOutput(prodServer.APP_STAGE),
        //         AWS_REGION: pipeline.stackOutput(prodServer.AWS_REGION),
        //         AWS_ACCOUNT_ID: pipeline.stackOutput(prodServer.AWS_ACCOUNT_ID),
        //         APPSYNC_API_URL: pipeline.stackOutput(
        //             prodServer.APPSYNC_API_URL
        //         ),
        //         APPSYNC_API_KEY: pipeline.stackOutput(
        //             prodServer.APPSYNC_API_KEY
        //         ),
        //         APPSYNC_REGION: pipeline.stackOutput(prodServer.APPSYNC_REGION),
        //         S3_URL: pipeline.stackOutput(prodServer.S3_URL),
        //         GOOGLE_CLIENT_ID: pipeline.stackOutput(
        //             prodServer.GOOGLE_CLIENT_ID
        //         ),
        //         GOOGLE_AUTHORIZED_ORIGIN_URIS: pipeline.stackOutput(
        //             prodServer.GOOGLE_AUTHORIZED_ORIGIN_URIS
        //         ),
        //         GOOGLE_AUTHORIZED_REDIRECT_URIS: pipeline.stackOutput(
        //             prodServer.GOOGLE_AUTHORIZED_REDIRECT_URIS
        //         ),
        //         GOOGLE_RESPONSE_TYPE: pipeline.stackOutput(
        //             prodServer.GOOGLE_RESPONSE_TYPE
        //         ),
        //         ELASTIC_SEARCH_ENDPOINT: pipeline.stackOutput(
        //             prodServer.ELASTIC_SEARCH_ENDPOINT
        //         ),
        //         ELASTIC_SEARCH_USERNAME: pipeline.stackOutput(
        //             prodServer.ELASTIC_SEARCH_USERNAME
        //         ),
        //         OWNER_NAME: pipeline.stackOutput(prodServer.OWNER_NAME),
        //         OWNER_EMAIL: pipeline.stackOutput(prodServer.OWNER_EMAIL),
        //         OWNER_IMAGE: pipeline.stackOutput(prodServer.OWNER_IMAGE)
        //     }
        // })

        // prodStage.addActions(prodTestAction)

        // prodTestAction.project.role?.attachInlinePolicy(
        //     new Policy(
        //         this,
        //         `${prodStageName}-${config.APP_NAME}-TestActionRole`,
        //         {
        //             statements: [
        //                 new PolicyStatement({
        //                     actions: [
        //                         'ssm:GetParameters',
        //                         'ssm:GetParameter',
        //                         'secretsmanager:GetSecretValue'
        //                     ],
        //                     resources: ['*'],
        //                     effect: Effect.ALLOW
        //                 })
        //             ]
        //         }
        //     )
        // )
    }
}
