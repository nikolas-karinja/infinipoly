import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient } from 'mongodb'
import { log } from './core/utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const DEV  = false
const PORT = process.env.PORT || 3000

const App = express()
// const DB  = new MongoClient('mongodb+srv://nikolas-karinja:HVBy7PaYGtFUbzeg@universal.awqcoyk.mongodb.net/?retryWrites=true&w=majority')

// set express headers
App.use(express.static(path.resolve(__dirname, '../client/build')))
App.use(bodyParser.urlencoded({ extended: true }))
App.use(bodyParser.json())

// if the site is going into production
if (!DEV)
{
    App.get('*', (req, res) => 
    {
	    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
    })
}

// start listening for posts
App.listen(PORT, () => 
{
    log(`Server listening on ${ PORT }`)
})

// start database and dependent methods
const initServer = async () =>
{
	// log('Connecting to DB...', true)

	// await DB.connect()

	// log('Connected! Database available for use.', true)
}

initServer()