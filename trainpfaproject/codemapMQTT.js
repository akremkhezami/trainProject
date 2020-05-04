



var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://54.36.182.216:1883');
// var topic = '150E';
var msg = '{ "latitude": 10.315291, "longitude" : 36.737106, "vitesse" : 0.129640}' ; 

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


function mqttConnectAndpublish(topic,msg) {

  client.on('connect', () => {
      
      client.publish(topic, msg);
      console.log('message sent !');
  })
}
 

function mqttConnectAndsubscribe(topic) {
    
 

  client.on('connect', () => {
      client.subscribe(topic);
      client.on('message', (topic,message) => {
        console.log('inside message');
        message = message.toString('utf8');
        const obj = JSON.parse(message); 
         console.log(obj);
        
    
      })
  })



}


//console.log(getDistanceFromLatLonInKm(36.72869245607467,10.33548263935836,36.72909616937506,10.334908229303078));


 mqttConnectAndsubscribe('150E');
 mqttConnectAndpublish('150E',msg);
