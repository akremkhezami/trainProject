const mongoose = require("mongoose");

var stationScheme = new mongoose.Schema({

     
        name : String ,
        type : String ,
        location : {
            longitude : Number ,
            latitude : Number
        } ,
        nextWayPointUp : {
            name : String ,
            distance : Number ,
            time : Number
        } ,
        nextWayPointDown : {
            name : String ,
            distance : Number ,
            time: Number
        }
        
    }

);


const Stations = mongoose.model("stations", stationScheme);
module.exports = Stations ;




