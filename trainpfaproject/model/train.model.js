
const mongoose = require("mongoose");

var trainScheme = new mongoose.Schema(
    
    
    {
        code: String ,
        currentLocation: String,
        lastKnownStation: String,
        deTunis: Boolean,
        active: Boolean
    });
    
    
    const Trains = mongoose.model("trains", trainScheme);
    module.exports = Trains ;