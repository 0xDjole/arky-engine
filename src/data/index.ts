#!/usr/bin/env node
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { error, errorMessages } from 'services'
import util from 'util'
import yargs from 'yargs/yargs'

const { argv } = yargs(process.argv.slice(2)).options({
    local: { type: 'boolean', default: false },
    seedName: { type: 'string', default: '' }
})

const loadDotEnv = () => argv.local && dotenv.config()

loadDotEnv()

const readdirAsync = util.promisify(fs.readdir)

const seedPath = path.join(__dirname, 'seed')

const run = async (): Promise<boolean> => {
    const seedDir = path.resolve(seedPath)

    const fileNames = await readdirAsync(seedDir)

    const filePaths = fileNames
        .map(fileName => path.join(seedPath, fileName))
        .filter(fileName => fileName.split('-')[1] === `${argv?.seedName}.ts`)

    if (!filePaths.length)
        throw error({
            message: errorMessages['en-US'].NO_SEED
        })

    for (const filePath of filePaths) {
        const seed = await import(filePath)
        seed.up()
    }

    return true
}

run()
