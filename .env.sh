#!/bin/bash

# Environments defined in pre-AWS deployment. We need them before the actual deployment of the pipeline and the stack.
# It consists of Google creds, elastic search, owner data and github token.
# Passwords and secrets are inserted using Secrets Manager, while normal string are inserted in param store.

APP_NAME='Tox'
AWS_ACCOUNT_ID='128973290805'
AWS_REGION='eu-central-1'
GOOGLE_CLIENT_ID='582292934606-ukek85j63rp34iq094lvb1enaf7q45uq.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET='TfOcfm-FLV51d1frIctHLPG-'
GOOGLE_AUTHORIZED_ORIGIN_URIS='["http://localhost:3000","https://tox.arky.io"]'
GOOGLE_AUTHORIZED_REDIRECT_URIS='["http://localhost:3000/google/callback","https://tox.arky.io/google/callback"]'
GOOGLE_RESPONSE_TYPE='code'
ELASTIC_SEARCH_ENDPOINT='https://8650d108910a4fa288479fdba999bea4.eu-central-1.aws.cloud.es.io:9243'
ELASTIC_SEARCH_PASSWORD='rzXAfpQLPL1Me9SqFphW0OoP'
ELASTIC_SEARCH_USERNAME='elastic'
OWNER_NAME='TechArky'
OWNER_EMAIL='tech@arky.io'
OWNER_PASSWORD='TechArky123!'
OWNER_IMAGE='PLACE_HOLDER'
KAFKA_CLUSTER_ID='lkc-yx586'
KAFKA_BROKERS='["pkc-lq8v7.eu-central-1.aws.confluent.cloud:9092"]'
CASSANDRA_KEYSPACE='tox'
CASSANDRA_USERNAME='rjTtECSHBTOcfwHukNbkKAbX'
CASSANDRA_PASSWORD='OjSrRZj7m_lI3-BEoZldEG3Auqp9v8,Zz9IN0iISvacmIBD+Z+BAolpNWY-O8Znc2cS6jNXJ6Obhn86++eRUysSZWI+1+x782,GH1QmyNh4qBAvMfJyjvtiTptFBfDsS'

GITHUB_TOKEN='4eb7901d86afcbf79bde951cb9a38e6ac1f1f1e7'

# aws secretsmanager create-secret --name /$APP_NAME/GITHUB_TOKEN --secret-string $GITHUB_TOKEN

for STAGE in "Prod"
do
    PARAMETER_PATH=/$APP_NAME/$STAGE/
    # aws ssm put-parameter --name $PARAMETER_PATH"GOOGLE_CLIENT_ID" --value $GOOGLE_CLIENT_ID --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"GOOGLE_AUTHORIZED_ORIGIN_URIS" --value $GOOGLE_AUTHORIZED_ORIGIN_URIS --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"GOOGLE_AUTHORIZED_REDIRECT_URIS" --value $GOOGLE_AUTHORIZED_REDIRECT_URIS --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"GOOGLE_RESPONSE_TYPE" --value $GOOGLE_RESPONSE_TYPE --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"ELASTIC_SEARCH_ENDPOINT" --value $ELASTIC_SEARCH_ENDPOINT --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"ELASTIC_SEARCH_USERNAME" --value $ELASTIC_SEARCH_USERNAME --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"OWNER_NAME" --value $OWNER_NAME --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"OWNER_EMAIL" --value $OWNER_EMAIL --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"OWNER_IMAGE" --value $OWNER_IMAGE --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"KAFKA_CLUSTER_ID" --value $KAFKA_CLUSTER_ID --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"KAFKA_BROKERS" --value $KAFKA_BROKERS --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"CASSANDRA_KEYSPACE" --value $CASSANDRA_KEYSPACE --type String --region $AWS_REGION
    # aws ssm put-parameter --name $PARAMETER_PATH"CASSANDRA_USERNAME" --value $CASSANDRA_USERNAME --type String --region $AWS_REGION

    # aws secretsmanager create-secret --name $PARAMETER_PATH"GOOGLE_CLIENT_SECRET" --secret-string $GOOGLE_CLIENT_SECRET
    # aws secretsmanager create-secret --name $PARAMETER_PATH"ELASTIC_SEARCH_PASSWORD" --secret-string $ELASTIC_SEARCH_PASSWORD
    # aws secretsmanager create-secret --name $PARAMETER_PATH"OWNER_PASSWORD" --secret-string $OWNER_PASSWORD
    # aws secretsmanager create-secret --name $PARAMETER_PATH"KAFKA_SECRET" --secret-string file://kafkaSecret.json
    # aws secretsmanager create-secret --name $PARAMETER_PATH"CASSANDRA_PASSWORD" --secret-string $CASSANDRA_PASSWORD

done
