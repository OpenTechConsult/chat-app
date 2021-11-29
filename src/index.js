const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

app.listen(port, () => console.log(`Server listening on port ${port}!`))

// Goal: Setup scripts in package.json
// 1. Create a "start" script to start the app using node
// 2. Install nodemon as a development dependency
// 3. Create a "dev" script to start the app using nodemon
// 4. Run both scripts to test the work
