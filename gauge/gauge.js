$(document).on('pagecreate', function (bevent, bdata) {
		
	// ----- plot.gauge-solid ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.gauge-solid"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			//debug: console.log("[plot.gauge-solid] '" + this.id + "' update: " + response);	
			
			var stop = [];
			if ($(this).attr('data-stop') && $(this).attr('data-color')) {
				var datastop = $(this).attr('data-stop').explode();	
				var color = $(this).attr('data-color').explode();
							
				if (datastop.length == color.length)
				{
					for (var i = 0; i < datastop.length; i++) {
						stop[i] = [ +datastop[i], color[i]]
					}
				}			
			}
			
			var startAngle = -90;
			var endAngle = 90;
			var shape = 'arc';
			var step = 1;
			var distance = -15;
			var yHeadline = 30; //20;
			var yLabel = 16;
			var yDataLabel = 23;
			var center = ['42%', '85%'];
			var size = $(this).attr('data-label') ? '112%' : '166.65%';
			var height = 150;
			var isLabel = true;
			if ($(this).attr('data-mode') == 'cshape')
			{
				startAngle = -130;
				endAngle = 130;
				distance = -25;
				height = 200;
				yLabel = 20;
				yDataLabel = -25;
				center = ['42%', '60%'];
				size = $(this).attr('data-label') ? '80%' : '104.46%';
			}
			else if ($(this).attr('data-mode') == 'circle')
			{
				startAngle = 0;
				endAngle = 360;
				yHeadline = 5;
				height = 205;
				yLabel = -20;
				yDataLabel = -25;
				center = ['42%', '50%'];
				size = $(this).attr('data-label') ? '77.76%' : '100.72%';
				shape = 'circle';
				step = 2;
			}
			var headline = $(this).attr('data-label') ? null : $(this).attr('data-label');
			var axis = $(this).attr('data-axis').explode();			
			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');
			var percent = (((response - diff) * 100) / range);				
									
			$(this).highcharts({
				chart: {
					type: 'solidgauge',
					width: 200,
					height: height,
					marginLeft: 15,
					marginRight: -15,
					spacing: [0, 0, 5, 0]
				},

				title: {
					text: headline,
					y: yHeadline			
				},

				pane: {
					center: center,
					//size: '170%',
					size: size,
					startAngle: startAngle,
					endAngle: endAngle,
					background: [{
						outerRadius: '100%',
						innerRadius: '60%',
						shape: shape
					}]
				},

				tooltip: {
					enabled: false
				},

				// the value axis
				yAxis: {
					min: 0,
					max: 100,
					title: {
						text: headline
					},
					stops: stop.length > 0 ? stop : null,
					lineWidth: 0,
					gridLineColor: 'rgba(255, 255, 255, 0)',
					minorTickInterval: null,
					tickAmount: 2,
					title: {
						y: -70
					},
					labels: {
						distance: distance,
						step: step,
						y: yLabel,
						enabled: isLabel,
						formatter: function () {return (((this.value * range) / 100) + diff)}
					}
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							y: yDataLabel,
							borderWidth: 0,
							useHTML: true
						}
					},
					linecap: 'round',
					stickyTracking: false,
					rounded: true
				},
				
				series: [{
					name: headline,
					data: [percent],
					dataLabels: {
						formatter: function () {return '<div class="display"><span class="value">' + (((this.y * range) / 100) + diff).transUnit('dec') + '</span><br/><span class="unit">' + axis + '</span></div>'}
					},
					tooltip: {
						valueSuffix: ' ' + axis
					}
				}]
			});
		},
		
		'point': function (event, response) {
			
			//debug: console.log("[plot.gauge-solid] '" + this.id + "' point: " + response);

			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');
			var percent = (((response - diff) * 100) / range);			
			
			if (response)
			{
				var chart = $(this).highcharts();
				chart.series[0].points[0].update(percent);
				chart.redraw();	
			}
		}
	});
	
	// ----- plot.gauge-angular ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.gauge-angular"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			//debug: console.log("[plot.gauge-angular] '" + this.id + "' update: " + response);	
			
			var headline = $(this).attr('data-label') == '' ? null : $(this).attr('data-label');
			var unit = $(this).attr('data-unit');
			var axis = $(this).attr('data-axis').explode();
			var mode = $(this).attr('data-mode');
			var color = $(this).attr('data-color');
			
			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');
			var percent = (((response - diff) * 100) / range);
			var size = $(this).attr('data-label') == '' ? '100%' : '110%';
								
			var yaxis = [];
			var gauge = [];
			var pane = [];
			var series = [];					
			for (i = 0; i < response.length; i++) {		
				if (mode == 'scale') {
					yaxis[i] = {
						min: 0,
						max: 100,					
						lineWidth: 0,
						minorTickInterval: 1.5,
						minorTickWidth: 2,
						minorTickLength: 17,
						minorTickPosition: 'inside',
						minorTickColor: '#444',
						tickWidth: 0,
						labels: {
							enabled: true,
							step: 4,
							y: 18,
							distance: -18,
							style: {'color': 'grey'},
							formatter: function () {return (((this.value * range) / 100) + diff)}
						},
						plotBands: [{
							outerRadius: '99%',
							thickness: 15,
							from: 0,
							to: percent,
							color: color ? color : Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.8).get(),
							id: 'pb1'
						}, {
							outerRadius: '99%',
							thickness: 15,
							from: percent,
							to: 120,
							color: 'rgba(255, 255, 255, 0.2)',
							id: 'pb2'
						}],
						title: {
							text: axis[i],
							style: {
								color: '#bbb',
								fontSize: '15px',
							},
							y: 14
						}
					}			
					gauge[i] = {
						dial: {
							radius: '100%',
							color: '#eee',
							backgroundColor: '#eee',
							baseWidth: 3,
							topWidth: 3,
							baseLength: '90%', // of radius
							rearLength: '-70%'
						},
						pivot: {
							radius: 0
						}
					}
					pane[i] = {
						startAngle: -130,
						endAngle: 130,
						background: [{
							backgroundColor: '#555',
							borderWidth: 0,
							outerRadius: '108%'
						}]
					}
					series[i] = {
						name: headline,
						data: [percent],
						yAxis: i,
						dataLabels: {
							borderWidth: 0,
							formatter: function () {return (((this.y * range) / 100) + diff).transUnit('dec')},
							style: {
								fontSize: '30px',
								color: 'grey',
							},
							y: -20
						},
						tooltip: {
							enabled: false
						}
					}	
				}
				else
				{
					yaxis[i] = {
						min: 0,
						max: 100,	
						minorTickInterval: 'auto',
						minorTickWidth: 1,
						minorTickLength: 10,
						minorTickPosition: 'inside',
						minorTickColor: '#666',
						tickPixelInterval: 30,
						tickWidth: 2,
						tickPosition: 'inside',
						tickLength: 10,
						tickColor: '#666',
						labels: {
							step: 2,
							rotation: 'auto',
							formatter: function () {return (((this.value * range) / 100) + diff)}
						},
						title: {
							text: axis[i]
						},
						plotBands: [{
							from: 0,
							to: 60,
							color: '#55BF3B' // green
						}, {
							from: 60,
							to: 80,
							color: '#DDDF0D' // yellow
						}, {
							from: 80,
							to: 100,
							color: '#DF5353' // red
						}]
					}
					gauge[i] = {						
					}
					pane[i] = {
						startAngle: -150,
						endAngle: 150,
						size: size,
						background: [{
							backgroundColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
								stops: [
									[0, '#FFF'],
									[1, '#333']
								]
							},
							borderWidth: 0,
							outerRadius: '109%'
						}, {
							backgroundColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
								stops: [
									[0, '#333'],
									[1, '#FFF']
								]
							},
							borderWidth: 1,
							outerRadius: '107%'
						}, {
						// default background
						}, {
							backgroundColor: '#DDD',
							borderWidth: 0,
							outerRadius: '105%',
							innerRadius: '103%'
						}]
					}
					series[i] = {
						name: headline,
						data: [percent],
						yAxis: i,
						dataLabels: {
							color: 'grey',
							formatter: function () {return (((this.y * range) / 100) + diff).transUnit('dec')}
						},
						tooltip: {
							valueSuffix: ' ' + axis
						}
					}
				}
			}
			
									
			$(this).highcharts({
				chart: {
					type: 'gauge',
					plotBackgroundColor: null,
					plotBackgroundImage: null,
					plotBorderWidth: 0,
					plotShadow: false
				},

				title: {
					text: headline			
				},
				
				plotOptions: {
					 gauge: gauge[0],
				},

				pane: pane,
				
				tooltip: {
					formatter: function() {return '<b>' + (((this.y * range) / 100) + diff).transUnit(unit) +  '</b>'}
				},

				// the value axis
				yAxis: yaxis,				
				series: series
			});				
		},
		
		'point': function (event, response) {
		
			//debug: console.log("[plot.gauge-speedometer] '" + this.id + "' point: " + response);

			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');
			var color = $(this).attr('data-color');
		
			var data = [];
			var items = $(this).attr('data-item').explode();		
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					data[i] = (((+response[i] - diff) * 100) / range);
				}
				else
				{
					data[i] = (((+widget.get(items[i]) - diff) * 100) / range);
				}
			}
		
			var chart = $(this).highcharts();
						
			for (i = 0; i < data.length; i++) {
				if($(this).attr('data-mode') == 'scale')
				{
					chart.yAxis[0].removePlotBand('pb1');
					chart.yAxis[0].addPlotBand({
						outerRadius: '99%',
						thickness: 15,
						from: 0,
						to: data[i],
						color: color ? color : Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.8).get(),
						id: 'pb1'
					});
					chart.yAxis[0].removePlotBand('pb2');
					chart.yAxis[0].addPlotBand({
						outerRadius: '99%',
						thickness: 15,
						from: data[i],
						to: 100,
						color: 'rgba(255, 255, 255, 0.2)',
						id: 'pb2'
					});
					chart.series[i].setData([data[i]], false);
				}
				else {		
					chart.series[i].points[0].update(data[i]);	
				}				
			}
			chart.redraw();	
		}
	});
	
	// ----- plot.gauge-vumeter ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.gauge-vumeter"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			//debug: console.log("[plot.gauge-vumeter] '" + this.id + "' update: " + response);	
			
			var headline = $(this).attr('data-label') == '' ? null : $(this).attr('data-label');
			var chartHeight = $(this).attr('data-label') == '' ? 150 : 200;
			
			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');
			var width = response.length > 1 ? null : 280;
									
			var axis = [];
			var pane = [];
			var series = [];					
			for (i = 0; i < response.length; i++) {									
				axis[i] = {
					min: 0,
					max: 100,					
					minorTickPosition: 'outside',
					tickPosition: 'outside',
					labels: {
						rotation: 'auto',
						distance: 20,
						formatter: function () {return (((this.value * range) / 100) + diff)}
					},
					plotBands: [{
						from: 70,
						to: 100,
						color: '#C02316',
						innerRadius: '100%',
						outerRadius: '105%'
					}],
					pane: i,
					title: {
						text: 'VU<br/><span style="font-size:8px">Channel ' + i + '</span>',
						y: -40
					}
				}
				pane[i] = {
					startAngle: -45,
					endAngle: 45,
					background: null,
					center: (i > 0 ? ['75%', '145%'] : (response.length > 1 ? ['25%', '145%'] : ['50%', '145%'])),
					size: 280
				}
				series[i] = {
					name: 'Channel ' + i,
					data: [(((response[i] - diff) * 100) / range)],
					yAxis: i
				}				
			}

												
			$(this).highcharts({
				chart: {
					type: 'gauge',
					plotBorderWidth: 1,
					plotBackgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, '#FFF4C6'],
							[0.3, '#FFFFFF'],
							[1, '#FFF4C6']
						]
					},
					plotBackgroundImage: null,
					width: width,
					height: chartHeight
				},

				title: {
					text: headline,					
				},

				pane: pane,
				
				tooltip: {
					enabled: false,
				},

				// the value axis
				yAxis: axis,
				
				plotOptions: {
					gauge: {
						dataLabels: {
							enabled: false
						},
						dial: {
							radius: '100%'
						}
					}
				},
				
				series: series,
			});				
		},
		
		'point': function (event, response) {
			
			//debug: console.log("[plot.gauge-vumeter] '" + this.id + "' point: " + response);

			var diff = ($(this).attr('data-max') - ($(this).attr('data-max') - $(this).attr('data-min')));
			var range = $(this).attr('data-max') - $(this).attr('data-min');
							
			var data = [];
			var items = $(this).attr('data-item').explode();		
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					data[i] = (((+response[i] - diff) * 100) / range);
				}
				else
				{
					data[i] = (((+widget.get(items[i]) - diff) * 100) / range);
				}
			}
		
			var chart = $(this).highcharts();
			for (i = 0; i < data.length; i++) {
				chart.series[i].points[0].update(data[i]);				
			}
			chart.redraw();	
		}
	});
	
});