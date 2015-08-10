var fs = require('fs');
var _ = require('lodash');

fs.readFile('test.json', 'utf-8', function(err, data) {
	if (err) throw err;
	parseData(data);
});






function parseData(data) {
	console.log('Parsing data');


	var parsedData = {
		name: 'Probe',
		children: []
	}

	var wirelessData = JSON.parse(data)['detection-run']['wireless-network'];

	_.forEach(wirelessData, function(item) {

		var obj = {
			name: item.SSID.essid['$t'] || 'Unknown',
			BSSID: item.BSSID,
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
fs.writeFile('test2.json', JSON.stringify(parsedData), function(err) {

		});

}