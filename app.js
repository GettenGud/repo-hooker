const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const puller = require('./puller')

const hookerLog = require('./db/hookerDB')


const urlEncodedParser = bodyParser.urlencoded( {extended:false} )
app.use(urlEncodedParser)

// Load the endpoint configurations

var endpoints = require('./config/endpoints.json')

// Create a route for each configuration

app.post('/update/:repo', urlEncodedParser, function (req,res) {

    
    let endpoint = endpoints[req.params.repo]
    if(endpoint != null && endpoint.secret == req.body.secret )
    {
        let result = puller.pullRepo(endpoint)
        hookerLog.logHook("push", req.ip, req.originalUrl, Date.now(), result)
        res.json({msg:"Good!"})
    }
    else{
        res.json({msg:"Good"})

    }

})

app.post('/review', urlEncodedParser, function(req, res) {
    res.json({output:puller.checkBuild(req.body.url)})
})

hookerLog.connect(() => {
    app.listen(8080, () => {console.log("Listening on port 8080.")})

})
