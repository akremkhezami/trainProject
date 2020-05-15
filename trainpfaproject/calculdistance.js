

module.exports = { mqttConnectAndpublish, mqttConnectAndsubscribe,deg2rad,getDistanceFromLatLonInKm}
const Stations = require("./model/station.model");
const Arrival = require("./model/arrivaltime.model");
var cred = { port: 1883, username: 'username', password: 'insat'};
const Train = require("./model/train.model");
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://54.36.182.216', cred);
let Station = new Stations();
var msg = '{ "traincode": "150E" ,"latitude": 36.74687194824219, "longitude" : 10.304576873779297, "vitesse" : 0.129640}' ; 



function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {

        R = 6371;

        rlon1 = deg2rad(lon1);
        rlon2 = deg2rad(lon2);
        rlat1 = deg2rad(lat1);
        rlat2 = deg2rad(lat2);

        dLat =  rlat2 - rlat1; 
        dLon =  rlon2 - rlon1;  

       a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(rlat1) * Math.cos(rlat2) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
        
         c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
         return (R * c ); // distance en km
 
 
}

// mqtt publish message on specific topic

function mqttConnectAndpublish(topic,msg) {
  
  return new Promise((resolve, reject) =>{ 
   
      client.on('connect', (error,res) => {
        
      client.publish(topic, msg);
       
       
         resolve('Message sent!');
         
    });
 }); 

 
} 
 

// mqtt subscribe  on specific topic

 


function mqttConnectAndsubscribe(topic) {

  return new Promise((resolve, reject) =>{ 

    client.on('connect' , () => { 
      client.subscribe(topic, (err) => { if(!err) { console.log('Subscribed to ' + topic)} }); 

      client.on('message' ,(topic,message) => {
        
          message = JSON.parse(message.toString('utf8'));
          resolve (message);        
           });
           
      
    });
  });
    

}



// get the closest station depends on the train position "longitude" & "latitude"

function getClosestStation(trainTopic) {

  client.on('connect', () => { 
    client.subscribe(trainTopic);
})

client.on('message', (trainTopic,message) => {
    
  message = message.toString('utf8');
  var Station = JSON.parse(message); 
    

  Stations.find((err,data) => { 
    if (data) {     
      var allstations = data; 
      allstations.forEach(station => {

        longitude = station.location.longitude;        
        latitude = station.location.latitude;  
         
       
        if(getDistanceFromLatLonInKm(latitude,longitude,Station.latitude,Station.longitude) < 0.05)
        {
           //n'updatiw train's position  
           updateTrains(station.traincode,station.name);
          
        }
      });  
    }  else
     {  console.log("BDD failed while retrieving data! ");      } 
       

  });
   
});


}



// MAJ de la position courante et précedente du train


function updateTrains(traincode,currentlocation) {

     Train.updateOne({ code: traincode }, { $set : {currentLocation: currentlocation }}, (err, res) => {
      if (err) throw err;    
        });

        Stations.findOne({ name :currentlocation }, (err, res) => {
          if (err) throw err;    
          
            Train.updateOne({ code: traincode }, { $set : {lastKnownStation: res.nextWayPointDown.name}}, (err, data) => {
             if (err) throw err;    
              });
            });

}



 





 function updatePanneaux(topicpanneaux,traintopic) {

    var arrive = new Arrival();


    mqttConnectAndsubscribe(traintopic).then((trainmsg) => { 
       
     Train.findOne({ code : trainmsg.traincode }, (err, res) => {  
          if (err) throw err;  

            arrive.currentstation = res.currentLocation;
            arrive.traincode = trainmsg.traincode;
            arrive.stationame = topicpanneaux;

          
          timeremaining(arrive.currentStation,topicpanneaux)
               .then( result => { arrive.estimatedtime = result;  
                 return JSON.stringify(arrive);
              }).then(data => {  
                  
                       
                  client.publish(topicpanneaux, data);
                  
               
              });
               
             }); 
    
    
    }); 
      
    mqttConnectAndpublish(traintopic,msg).then((msg) => console.log(msg));
 
}
  



            // Calcul mta3 el wa9t mebin les deux station 
 

 function timeremaining(currentStation,destinationStation) {
   
   var timeEstimated = 0;
   return new Promise((resolve, reject) =>{ 
   Stations.find().then(data => { 
    if (data) {     

      var indexCurrent = data.findIndex(station => station.name == currentStation); 
      var indexDest = data.findIndex(station => station.name == destinationStation);       
      for (var i = indexCurrent + 1   ; i< indexDest; i++){

        timeEstimated += data[i].nextWayPointUp.time ;

      } 
        resolve(timeEstimated);
     }  else
     {  console.log("BDD failed while retrieving data!"); 
         reject("BDD failed while retrieving data!");
    } 
     
     
  });

});



  }
               

      
              
  getClosestStation('150E');         
  updatePanneaux('Boukornine','150E');



