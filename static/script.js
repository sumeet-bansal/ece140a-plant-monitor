var color1 = '#9966ff';
var color2 = '#428bca';
var color3 = '#5cb85c';
var color4 = '#d9534f';
var color5 = '#fc9c36';

var options = {
	scales: {
		yAxes: [{
			ticks: {
				beginAtZero: true
			}
		}],
		xAxes: [{
			ticks: {
				maxTicksLimit: 12
			}
		}]
	},
	responsive: false
}

function load() {
data = '{"temp": [70.5, 70.5, 70.3, 70.3, 70.3, 70.3, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.0, 70.1, 70.1, 70.1, 70.1, 70.1, 70.2, 70.1, 70.1, 70.2, 70.1, 70.0, 70.0, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1, 70.1], "envelope": [12, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 12, 11, 13, 12, 12, 13, 49, 49, 49, 12, 49, 12, 12, 11, 11, 14, 15, 11, 12, 12, 12, 12, 11, 11, 12, 13, 11, 11, 11, 12, 13, 11, 12, 12, 12, 11, 11, 11, 12, 12, 12, 11, 12, 12, 11, 11, 12], "humidity": [16.0, 16.1, 15.9, 16.0, 15.9, 16.1, 16.1, 16.0, 16.0, 16.0, 16.1, 16.0, 16.0, 16.0, 16.0, 15.9, 15.9, 16.0, 16.0, 16.0, 16.0, 16.0, 16.1, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 15.9, 15.9, 15.8, 15.9, 15.9, 15.9, 15.9, 16.0, 16.0, 16.0, 15.9, 15.9, 15.9, 16.0, 16.0, 16.0, 15.9, 15.9, 15.9, 15.8, 15.7, 15.9, 15.8, 15.9, 15.8, 15.9, 15.8, 15.8, 15.7, 15.7], "gate": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 13, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "audio": [14, 17, 17, 17, 18, 19, 19, 15, 23, 18, 21, 16, 16, 14, 16, 18, 16, 23, 26, 75, 117, 107, 19, 83, 20, 20, 15, 19, 28, 29, 16, 18, 22, 18, 21, 16, 17, 21, 26, 17, 17, 17, 20, 26, 17, 17, 16, 17, 16, 16, 16, 20, 19, 20, 16, 19, 20, 16, 18, 16]}'
	console.log("{{entries}}");
	var readings = JSON.parse(data);
	generateChart(readings);
}

function generateChart(readings) {

	console.log(readings);

	// sets up y-axis as interval [0, 60)
	var timeframe = [];
	for (var i = 0; i < 60; i++) {
		timeframe.push(i);
	}

	console.log(typeof(document.getElementById("Temperature")));
	var ctx = document.getElementById("Temperature-chart").getContext('2d');
	var myLineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: timeframe,
			datasets: [{
				label: 'Temperature',
				data: readings.temp,
				backgroundColor: color1,
				borderColor: color1,
				fill: false,
				borderWidth: 1
			}]
		},
		options: options
	});

	var ctx = document.getElementById("Humidity-chart").getContext('2d');
	var myLineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: timeframe,
			datasets: [{
				label: 'Humidity',
				data: readings.audio,
				backgroundColor: color2,
				borderColor: color2,
				fill: false,
				borderWidth: 1
			}]
		},
		options: options
	});

	var ctx = document.getElementById("Sound-chart").getContext('2d');
	var myLineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: timeframe,
			datasets: [{
				label: 'Noise',
				data: readings.audio,
				backgroundColor: color3,
				borderColor: color3,
				fill: false,
				borderWidth: 1
			}, {
				label: 'Envelope',
				data: readings.envelope,
				backgroundColor: color4,
				borderColor: color4,
				fill: false,
				borderWidth: 1
			}, {
				label: 'Gate',
				data: readings.gate,
				backgroundColor: color5,
				borderColor: color5,
				fill: false,
				borderWidth: 1
			}]
		},
		options: options
	});

}
