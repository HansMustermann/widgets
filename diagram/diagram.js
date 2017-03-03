$(document).on('pagecreate', function (bevent, bdata) {

	// ----- diagram plot.pie ----------------------------------------------------------
	$(bevent.target).find('div[data-widget="plot.pie"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			// DEBUG: console.log("[plot.pie] '" + this.id + "': " + response + ' ' + response.length);	
			
			var isLabel = false;
			var isLegend = false;			
			var labels = [];
			if ($(this).attr('data-label')) {
				labels = $(this).attr('data-label').explode();
				isLabel = true;
			}			
			if ($(this).attr('data-mode') == 'legend') {
				isLegend = true;
				isLabel = false;
			}
			else if ($(this).attr('data-mode') == 'none') {
				isLabel = false;
			}
			var colors = [];
			if ($(this).attr('data-color')) {
				colors = $(this).attr('data-color').explode();
			}
			var val = 0;
			for (i = 0; i < response.length; i++) {
				val = val + response[i];
			}
			var data = [];
			for (i = 0; i < response.length; i++) {				
				data[i] = {
					name: labels[i],
					y: response[i] * 100 / val,
					color: (colors[i] ? colors[i] : null)
				}			
			}
					
			// design
			var headline = $(this).attr('data-text');
			var position = 'top';
			if ($(this).attr('data-text') == '') {
				position = 'bottom';
			}
				
			// draw the plot
			$(this).highcharts({
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'	
						
				},
				legend: {
					align: 'center',
					verticalAlign:  position,
					x: 0,
					y: 20
				},
				title: {
					text: headline
				},
				tooltip: {
					formatter: function() {
						return this.point.name + ' <b>' + this.y.transUnit('%') + '</b>';
					},
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: isLabel,
							formatter: function() {
								return this.point.name + ' <b>' + this.y.transUnit('%') + '</b>';
							},							
							style: {
								color: null
							}
						},
						showInLegend: isLegend
					}
				},						
				series: [{
					name: headline,
					colorByPoint: true,
					data: data
				}],
			});
		},
		'point': function (event, response) {
			
			// DEBUG: console.log("[plot.pie point] '" + this.id + "': " + response);	
			
			var val = 0;
			var data = [];
			var items = $(this).attr('data-item').explode();		
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					val = val +  +response[i];
				}
				else
				{
					val = val +  +widget.get(items[i]);
				}
			}
			for (i = 0; i < items.length; i++) {
				if (response[i]) {
					data[i] = +response[i] * 100 / val;
				}
				else
				{
					data[i] = +widget.get(items[i]) * 100 / val;
				}
			}
		
			var chart = $(this).highcharts();
			for (i = 0; i < data.length; i++) {
				chart.series[0].data[i].update(data[i]);				
			}
			chart.redraw();			
		},
	});

});