const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Stations = require("../model/station.model");
const Trains = require("../model/train.model");




// Stations Section


router.post("/addstations", (req , res) => {

        Stations.create(req.body).then(data => {
            if (data)
            {
                res.send(data);
             }
             else
             {
                 res.send("Error occured!");
             }
        });      
});

router.get("/liststations", (req,res)=>{
         
    Stations.find((err,data) => {
        if (!err) {
         
            res.send(data);
        }
    });
    
});

// Trains Section

router.get("/listtrains", (req,res)=>{
         
    Trains.find((err,data) => {
        if (!err) {
           
            res.send(data);
        }
    });
    
});


router.post("/addtrains", (req , res) => {

    Trains.create(req.body).then(data => {
        if (data)
        {
            res.send(data);
         }
         else
         {
             res.send("Error occured!");
         }
    });      
});


module.exports = router;

