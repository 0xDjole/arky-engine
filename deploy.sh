#!/bin/bash

# We run this script only one time to deploy pipeline. Rest will be taken care of.
export CDK_NEW_BOOTSTRAP=1 

chmod +x .env.sh

./.env.sh

# Set env secrets
npx cdk bootstrap

cdk deploy

rm -rf dist
rm -rf cdk.out
