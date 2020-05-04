const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/trainproject", { useNewUrlParser: true , useUnifiedTopology: true},
            (error) => {
                    if (!error){
                        console.log("Success Mongodb connected!!!");
                    }
                    else { console.log("fail!");}

            });

             