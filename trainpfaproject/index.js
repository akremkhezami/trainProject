const connection = require("./model");
const express = require("express");
const application = express();
const path = require("path");
const expressHandlebars = require("express-handlebars");
const bodyparser = require ("body-parser");
const trainController = require("./controllers/train");
const calDistance = require ("./calculdistance");
const Stations = require("./model/station.model");

application.use( bodyparser.json({
        extended : true 

}));

application.get("/", (req, res) => {
    
 res.send("Bienvenue TRAIN API : '/stations/list' ou bien '/stations/add' " );
})

application.use("/api", trainController);


application.listen("3000" , ()=> { console.log("server started");})





