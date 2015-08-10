var firebase = require('firebase');
var firebaseData = new firebase('https://reality-versioning.firebaseio.com/data');
var _ = require('lodash');
var fs = require('fs');

function getClientIp(req) {
  
  var ipAddress;
  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};


exports.data = function(req, res) {
  //firebaseData.set(req.body);

// var test = JSON.stringify(req.body);
//   fs.writeFile('test.json', test, function(err) {

//   });
  parseData(req.body);
  res.status(200).end('ok');
};


function parseData(data) {
  console.log('Parsing data');

  var parsedData = {
    name: 'Probe',
    children: []
  }

  var wirelessData = data['detection-run']['wireless-network'];


  _.forEach(wirelessData, function(item) {

    var obj = {
      name: item.SSID.essid['$t'] || 'Unknown',
      BSSID: item.BSSID,
      encryption: item.SSID.encryption || 'Unknown',
      //power: item['snr-info'].last_signal_dbm,
      children: []
    }

    // Check if we have wireless clients
    if (item['wireless-client'] !== undefined) {

      // Check if there are multiple clients
      if (_.isArray(item['wireless-client'])) {

        // Iterate through this
        _.forEach(item['wireless-client'], function(client) {
          var clientObj = {
            name: client['client-mac'],
            children: []
          };

          obj.children.push(clientObj);
        });
      } else {
        var clientObj = {
          name: item['wireless-client']['client-mac'],
          children: []
        };

        obj.children.push(clientObj);
      }

      parsedData.children.push(obj);
    }


  });

  // push data
  firebaseData.set(parsedData);
}