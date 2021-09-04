#!/bin/bash

# Compile typescript
tsc

# Cassandra zip
cp src/services/core/utils/secure-connect-tox.zip dist/services/core/utils/secure-connect-tox.zip

# Begin the build
cp src/appSyncApi/schema.graphql dist/appSyncApi/schema.graphql 

mkdir -p dist/assets/icons 
cp src/assets/icons/** dist/assets/icons 

# Build node_modules layer
rm -rf dist/nodeModules
mkdir -p dist/nodeModules/nodejs

cp -R src/nodeModules/** dist/nodeModules/nodejs
npm install --prefix ./dist/nodeModules/nodejs

# Build services layer
mkdir -p dist/services/nodejs/node_modules/services
mv ./dist/services/*  dist/services/nodejs/node_modules/services 2>/dev/null

cdk synthesize

echo Finished build