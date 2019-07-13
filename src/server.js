import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import util from 'util'
import yargs from 'yargs'

import * as Translate from './translate'
import * as Util from './util'

const {
    root,
    port = 3000
} = yargs.argv

;(async () => {
    console.log('Root:', root)
    console.log('Port:', port)

    const app = express()
    app.use(cors())

    app.get('/:filename(*)', async (req, res) => {
        const { filename } = req.params

        try {
            const fullPath = Util.protojoin(root, filename)
            const body = await Translate.translate(fullPath)
            return res.send(body)
        }
        catch (e) {
            console.log('Caught during', filename, e)
            return res.status(500).send(e.message)
        }
    })

    const server = http.createServer(app)
    const listen = util.promisify(server.listen.bind(server))
    await listen(port)
    console.log('Listening')
})()
