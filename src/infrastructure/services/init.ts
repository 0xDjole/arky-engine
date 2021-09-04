#!/usr/bin/env node
import 'source-map-support/register'

import * as cdk from '@aws-cdk/core'
import config from 'config'

import { PipelineStack } from './pipelineStack'

const app = new cdk.App()

new PipelineStack(app, `${config.APP_NAME}-PipelineStack`, {
    env: {
        account: '128973290805',
        region: 'eu-central-1'
    }
})

app.synth()
