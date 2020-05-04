const mongoose = require("mongoose");

var arrivaltimeScheme = new mongoose.Schema({

     
      stationame : String,
      traincode: String,
      currentstation: String,
      estimatedtime: Number
        
    }

);


  const Arrivaltime = mongoose.model("arrivaltime", arrivaltimeScheme);
  module.exports = Arrivaltime ;




