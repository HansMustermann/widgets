// ----- steelseries buffer ----------------------------------------------------
var steel = {};
// -----------------------------------------------------------------------------

$(document).on('pagecreate', function (bevent, bdata) {		
	
	// ----- steel.radial ------------------------------------------------------
	$(bevent.target).find('canvas[data-widget="steel.radial"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			//debug: console.log("[steel.radial] '" + this.id + "' update: " + response + " " + response.length);
					
			if ($(this).attr('data-widget').substr(0, 6) == 'steel.' && steel[this.id]) {
				$(this).trigger('point', [response]);
			}		
			else
			{	
				var unit = $(this).attr('data-unit');
				var label = $(this).attr('data-label');
				var mode = $(this).attr('data-mode').explode();
				
				var set = $(this).attr('data-settings').explode();
				var type = steelseries.GaugeType[set[0] && set[0] != '' ? 'TYPE' + set[0] : 'TYPE4'];
				var backgroundColor = steelseries.BackgroundColor[set[1] && set[1] != '' ? set[1].toUpperCase() : 'DARK_GRAY'];
				var foregroundType = steelseries.ForegroundType[set[2] && set[2] != '' ? 'TYPE' + set[2] : 'TYPE3'];
				var frameDesign = steelseries.FrameDesign[set[3] && set[3] != '' ? set[3].toUpperCase() : 'STEEL'];
				var isLcd = set[4] && set[4] == 'true' ? true : false;
				var lcdColor = steelseries.LcdColor[set[5] && set[5] != '' ? set[5].toUpperCase() : 'STANDARD']
				var isLed = set[6] && set[6] == 'true' ? true : false;
				var ledColor = steelseries.LedColor[set[7] && set[7] != '' ? set[7].toUpperCase() + '_LED' : 'RED_LED'];
				var pointerType = steelseries.PointerType[set[8] && set[8] != '' ? 'TYPE' + set[8] : 'TYPE1'];
				var pointerColor = steelseries.ColorDef[set[9] && set[9] != '' ? set[9].toUpperCase() : 'RED'];
				var isTrend = set[10] && set[10] == 'true' ? true : false;
				var isMinMax = set[11] && set[11] == 'true' ? true : false;
				var threshold = [set[12] && set[12] != '' ? set[12] : (+$(this).attr('data-max') - +$(this).attr('data-min')) / 2];
				var digits = 3;
				var decimals = 1;
				var isSection = false;
				var isArea = false;
				
				var dataSection = $(this).attr('data-section') == 'null' ? [] : eval( '(' + $(this).attr('data-section') + ')' );
				var dataArea = $(this).attr('data-area') == 'null' ? [] : eval( '(' + $(this).attr('data-area') + ')' );
				
				var sections = [];			
				for (var i = 0; i < dataSection.length; i++) {
					if (dataSection.length == 1 && (dataSection[i] == 1 || dataSection[i] == 'true'))
					{
						isSection = true;
					}
					else
					{
						sections[i] = steelseries.Section(dataSection[i][0], dataSection[i][1], "rgba(" + dataSection[i][2] + ", " + dataSection[i][3] + ", " + dataSection[i][4] + ", " + dataSection[i][5] + ")");
					}
				}
				
				var areas = [];
				for (var i = 0; i < dataArea.length; i++) {
					if (dataArea.length == 1 && (dataArea[i] == 1 || dataArea[i] == 'true'))
					{
						isArea = true;
					}
					else
					{
						areas[i] = steelseries.Section(dataArea[i][0], dataArea[i][1], "rgba(" + dataArea[i][2] + ", " + dataArea[i][3] + ", " + dataArea[i][4] + ", " + dataArea[i][5] + ")");
					}
				}

				
				if(response.length >= 3)
				{
					threshold = (+$(this).attr('data-max') - +$(this).attr('data-min')) / 2;
					digits = set[12] && set[12] != '' ? set[12] : 3;
					decimals = set[13] && set[13] != '' ? set[13] : 1;
				}
				
				var settings = {
					gaugeType: type,
					minValue: parseFloat($(this).attr('data-min')),
					maxValue: parseFloat($(this).attr('data-max')),
					size: 401,
					backgroundColor: backgroundColor,
					foregroundType: foregroundType,
					frameDesign: frameDesign,
					titleString: label,
					unitString: unit,
					threshold: threshold,
					lcdVisible: isLcd,
					lcdColor: lcdColor,
					ledVisible: isLed,
					ledColor: ledColor,
					pointerType: pointerType,
					pointerColor: pointerColor,
					trendVisible: isTrend
				}
				
				if(isSection == true)
				{
					settings = $.extend({}, settings, {section: [steelseries.Section(0, 25, 'rgba(0, 0, 220, 0.3)'),steelseries.Section(25, 50, 'rgba(0, 220, 0, 0.3)'),steelseries.Section(50, 75, 'rgba(220, 220, 0, 0.3)')]});
				}
				else if (isSection == false && sections.length > 0)
				{
					settings = $.extend({}, settings, {section: sections});
				}
				
				if(isArea == true)
				{
					settings = $.extend({}, settings, {area: [steelseries.Section(75, 100, 'rgba(220, 0, 0, 0.3)')]});
				}
				else if (isArea == false && areas.length > 0)
				{
					settings = $.extend({}, settings, {area: areas});
				}
				
				if(isMinMax == true)
				{
					settings = $.extend({}, settings, {minMeasuredValueVisible: true, maxMeasuredValueVisible: true});
				}
								
				
				if(response.length >= 3)
				{
					settings = $.extend({}, settings, {lcdVisible: true, useOdometer: true, odometerParams: {decimals: +decimals, digits: +digits}});
				}
				
				if(mode[0] == 'bargraph')
				{					
					steel[this.id] = new steelseries.RadialBargraph(this.id, settings);	
				}
				else if(mode[0] == 'vertical')
				{		
					if(mode[1] == 'west' || mode[1] == 'east')	
					{	
						var orientation = steelseries.Orientation[mode[1].toUpperCase()];
						steel[this.id] = new steelseries.RadialVertical(this.id, $.extend({}, settings, { orientation: orientation, section: [], area: [], titleString: '', }));	
					}
					else
					{
						steel[this.id] = new steelseries.RadialVertical(this.id, settings);	
					}
				}
				else
				{
					steel[this.id] = new steelseries.Radial(this.id, settings);		
				}		
								
				if(response[1])
				{
					steel[this.id].setThreshold(parseFloat(response[1]));	
				}
				
				if(response.length >= 3)
				{
					steel[this.id].setOdoValue(parseFloat(response[2]));	
				}
				
				if(isTrend == true)
				{
					steel[this.id].setTrend(steelseries.TrendState.OFF);				
				}
				
				if(isMinMax == true)
				{
					if(response.length == 5)
					{
						steel[this.id].setMinMeasuredValue(parseFloat(response[3]));
						steel[this.id].setMaxMeasuredValue(parseFloat(response[4]));
						steel[this.id] = $.extend({}, steel[this.id], {oldValue: response[0], oldMinValue: response[3], oldMaxValue: response[4]});
					}
					else
					{
						steel[this.id].setMinMeasuredValue(parseFloat(response[0]));
						steel[this.id].setMaxMeasuredValue(parseFloat(response[0]));
						steel[this.id] = $.extend({}, steel[this.id], {oldValue: response[0], oldMinValue: response[0], oldMaxValue: response[0]});
					}	
					var id = this.id;
					steel[this.id].setValueAnimated(parseFloat(response[0]), function(){steel[id].setMinMeasuredValue(parseFloat(steel[id].oldMinValue))});	
				}	
				else
				{
					steel[this.id].setValueAnimated(parseFloat(response[0]));
				}					
			}
		},
		'point': function (event, response) {
			
			//debug: console.log("[steel.radial] '" + this.id + "' point: " + response + " " + response.length);
			
			if(response[1])
			{
				steel[this.id].setThreshold(parseFloat(response[1]));	
			}
			if(response.length >= 3)
			{
				steel[this.id].setOdoValue(+response[2]);	
			}
			
			var oldValue = parseFloat(steel[this.id].oldValue);
			var oldMinValue = parseFloat(steel[this.id].oldMinValue);
			var oldMaxValue = parseFloat(steel[this.id].oldMaxValue);
			
			if(response.length == 5)
			{
				steel[this.id].setMinMeasuredValue(parseFloat(response[3]));
				steel[this.id].setMaxMeasuredValue(parseFloat(response[4]));
			}
			else
			{
				if (oldMinValue > parseFloat(response[0])) 
				{
					steel[this.id].setMinMeasuredValue(parseFloat(response[0]));
					steel[this.id].oldMinValue = response[0];
				}
				if (oldMaxValue < parseFloat(response[0])) 
				{
					steel[this.id].setMaxMeasuredValue(parseFloat(response[0]));
					steel[this.id].oldMaxValue = response[0];
				}
			}
			
			if(parseFloat(response[0]) > oldValue)
			{
				steel[this.id].setTrend(steelseries.TrendState.UP);
			}
			else if(parseFloat(response[0]) < oldValue)
			{
				steel[this.id].setTrend(steelseries.TrendState.DOWN);
			}
			else
			{
				steel[this.id].setTrend(steelseries.TrendState.STEADY);
			}
			
			steel[this.id].setValueAnimated(parseFloat(response[0]));
			steel[this.id].oldValue = response[0];
		}
	});	
	
	// ----- steel.linear ------------------------------------------------------
	$(bevent.target).find('canvas[data-widget="steel.linear"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			//debug: console.log("[steel.linear] '" + this.id + "' update: " + response);
						
			if ($(this).attr('data-widget').substr(0, 6) == 'steel.' && steel[this.id]) {
				$(this).trigger('point', [response]);
			}		
			else
			{	
				var unit = $(this).attr('data-unit');
				var label = $(this).attr('data-label');
				var mode = $(this).attr('data-mode').explode();
				
				var set = $(this).attr('data-settings').explode();
				var type = steelseries.GaugeType[set[0] && set[0] != '' ? 'TYPE' + set[0] : 'TYPE1'];
				var backgroundColor = steelseries.BackgroundColor[set[1] && set[1] != '' ? set[1].toUpperCase() : 'DARK_GRAY'];
				var frameDesign = steelseries.FrameDesign[set[2] && set[2] != '' ? set[2].toUpperCase() : 'STEEL'];
				var isLcd = set[3] && set[3] == 'true' ? true : false;
				var lcdColor = steelseries.LcdColor[set[4] && set[4] != '' ? set[4].toUpperCase() : 'STANDARD'];
				var isLed = set[5] && set[5] == 'true' ? true : false;
				var ledColor = steelseries.LedColor[set[6] && set[6] != '' ? set[6].toUpperCase() + '_LED' : 'RED_LED'];
				var valueColor = steelseries.ColorDef[set[7] && set[7] != '' ? set[7].toUpperCase() : 'RED'];
				var isGradient = set[8] && set[8] == 'true' ? true : false;
				var threshold = [set[9] && set[9] != '' ? set[9] : (+$(this).attr('data-max') - +$(this).attr('data-min')) / 2];
				
				var isSection = false;
				var isArea = false;
				
				var dataSection = $(this).attr('data-section') == 'null' ? [] : eval( '(' + $(this).attr('data-section') + ')' );
				var dataArea = $(this).attr('data-area') == 'null' ? [] : eval( '(' + $(this).attr('data-area') + ')' );
				
				var sections = [];			
				for (var i = 0; i < dataSection.length; i++) {
					if (dataSection.length == 1 && (dataSection[i] == 1 || dataSection[i] == 'true'))
					{
						isSection = true;
					}
					else
					{
						sections[i] = steelseries.Section(dataSection[i][0], dataSection[i][1], "rgba(" + dataSection[i][2] + ", " + dataSection[i][3] + ", " + dataSection[i][4] + ", " + dataSection[i][5] + ")");
					}
				}
				
				var areas = [];
				for (var i = 0; i < dataArea.length; i++) {
					if (dataArea.length == 1 && (dataArea[i] == 1 || dataArea[i] == 'true'))
					{
						isArea = true;
					}
					else
					{
						areas[i] = steelseries.Section(dataArea[i][0], dataArea[i][1], "rgba(" + dataArea[i][2] + ", " + dataArea[i][3] + ", " + dataArea[i][4] + ", " + dataArea[i][5] + ")");
					}
				}
				
				var settings = {
					gaugeType: type,
					minValue: parseFloat($(this).attr('data-min')),
					maxValue: parseFloat($(this).attr('data-max')),
					size: 401,
					backgroundColor: backgroundColor,
					frameDesign: frameDesign,
					titleString: label,
					unitString: unit,
					threshold: threshold,
					lcdVisible: isLcd,
					lcdColor: lcdColor,
					ledVisible: isLed,
					ledColor: ledColor,
					valueColor: valueColor
				}
				
				if(mode[1] == 'vertical')
				{
					$(this).addClass('vertical');
					settings = $.extend({}, settings, {width: 140, height: 320});
				}
				
				if(isSection == true)
				{
					settings = $.extend({}, settings, {section: [steelseries.Section(0, 25, 'rgba(0, 0, 220, 0.3)'),steelseries.Section(25, 50, 'rgba(0, 220, 0, 0.3)'),steelseries.Section(50, 75, 'rgba(220, 220, 0, 0.3)')]});
				}
				else if (isSection == false && sections.length > 0)
				{
					settings = $.extend({}, settings, {section: sections});
				}
				
				if(isArea == true)
				{
					settings = $.extend({}, settings, {area: [steelseries.Section(75, 100, 'rgba(220, 0, 0, 0.3)')]});
				}
				else if (isArea == false && areas.length > 0)
				{
					settings = $.extend({}, settings, {area: areas});
				}
								
				if(mode[0] == 'bargraph')
				{						
					if(isGradient == true)	
					{
						steel[this.id] = new steelseries.LinearBargraph(this.id, $.extend({}, settings, {
											valueGradient: steelseries.gradientWrapper( 0, 100, [ 0, 0.33, 0.66, 0.85, 1],
															[ new steelseries.rgbaColor(0, 0, 200, 1),
															  new steelseries.rgbaColor(0, 200, 0, 1),
															  new steelseries.rgbaColor(200, 200, 0, 1),
															  new steelseries.rgbaColor(200, 0, 0, 1),
															  new steelseries.rgbaColor(200, 0, 0, 1) ]),
						}));	
					}
					else
					{
						steel[this.id] = new steelseries.LinearBargraph(this.id, settings);	
					}
				}
				else
				{
					steel[this.id] = new steelseries.Linear(this.id, settings);							
				}

				if(response[1])
				{
					steel[this.id].setThreshold(parseFloat(response[1]));	
				}
				steel[this.id].setValueAnimated(parseFloat(response[0]));					
			}
		},
		'point': function (event, response) {
			
			//debug: console.log("[steel.linear] '" + this.id + "' point: " + response);
			
			if(response[1])
			{
				steel[this.id].setThreshold(parseFloat(response[1]));	
			}
			steel[this.id].setValueAnimated(parseFloat(response[0]));
		}
	});	
	
	// ----- steel.display ------------------------------------------------------
	$(bevent.target).find('canvas[data-widget="steel.display"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			//debug: console.log("[steel.display] '" + this.id + "' update: " + response);
									
			if ($(this).attr('data-widget').substr(0, 6) == 'steel.' && steel[this.id]) {
				$(this).trigger('point', response);
			}		
			else
			{	
				var lcdColor = steelseries.LcdColor[$(this).attr('data-color') && $(this).attr('data-color') != '' ? $(this).attr('data-color').toUpperCase() : 'STANDARD'];
				var isUnit = $(this).attr('data-unit') && $(this).attr('data-unit') != '' ? true : false;
				var width = 240;
				var decimal = $(this).attr('data-settings') && $(this).attr('data-settings') != '' ? $(this).attr('data-settings') : 1;
				var settings = {
					width: width,
                    height: 100,
					lcdColor: lcdColor,
					lcdDecimals: decimal,
					unitString: $(this).attr('data-unit') && $(this).attr('data-unit') != '' ? $(this).attr('data-unit') : '',
                    unitStringVisible: isUnit,
				}
				
				if($(this).attr('data-mode') == 'text')
				{
					settings = $.extend({}, settings, {autoScroll: true, valuesNumeric: false, unitStringVisible: false});
				}
						
				steel[this.id] = new steelseries.DisplaySingle(this.id, settings);
				steel[this.id].setValue(parseFloat(response));					
			}
		},
		'point': function (event, response) {
			
			//debug: console.log("[steel.display] '" + this.id + "' point: " + response);
			
			steel[this.id].setValue(parseFloat(response));
		}
	});
	
	// ----- steel.lightbulb ------------------------------------------------------
	$(bevent.target).find('canvas[data-widget="steel.lightbulb"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			// response is: {{ gad_switch }},{{ gad_r }}, {{ gad_g }}, {{ gad_b }}, {{ gad_a }}
						
			$(this).val(response[0]);
			var max = $(this).attr('data-max');
						
			steel[this.id] = new steelseries.LightBulb(this.id, {width: 200, height: 200});			
			steel[this.id].setGlowColor("rgb(" + Math.round(response[1] / max * 255) + ", " + Math.round(response[2] / max * 255) + ", " + Math.round(response[3] / max * 255) + ")");
			steel[this.id].setAlpha(parseFloat(0.5 + ((response[4] / 100) / 2)));
			$(this).val() == $(this).attr('data-val-off') ? steel[this.id].setOn(0) :  steel[this.id].setOn(1);
		},
		'click': function(event){
			event.stopPropagation();

			$(this).val() == $(this).attr('data-val-off') ? steel[this.id].setOn(1) :  steel[this.id].setOn(0);
			io.write($(this).attr('data-switch'), ($(this).val() == $(this).attr('data-val-off') ? $(this).attr('data-val-on') : $(this).attr('data-val-off')) );
		}
	});
		
	// ----- steel.steel.colorbulb ------------------------------------------------------
	$(bevent.target).find('canvas[data-widget="steel.colorbulb"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			// response is: {{ gad_r }}, {{ gad_g }}, {{ gad_b }}
			
			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
				
			steel[this.id] = new steelseries.LightBulb(this.id, {width: 200, height: 200});
			

			steel[this.id].setGlowColor('rgb(' + 
				Math.round(Math.min(Math.max((response[0] - min) / (max - min), 0), 1) * 255) + ',' +
				Math.round(Math.min(Math.max((response[1] - min) / (max - min), 0), 1) * 255) + ',' +
				Math.round(Math.min(Math.max((response[2] - min) / (max - min), 0), 1) * 255) + ')');
							
			$(this).attr('data-val-on') == response[3] ? steel[this.id].setAlpha(100) : steel[this.id].setAlpha(0.5);	
			steel[this.id].setOn(1);			
		}
	})
	// color in rectangular display (as former basic.rgb)
	.filter('canvas[data-style="rect"]').on( {
		click: function(event) {
			
			var html = '<div class="rgb-popup">';
			
			var colors = parseInt($(this).attr('data-colors'));
			var steps = parseInt($(this).attr('data-step'));
			var step = Math.round(2 * 100 / (steps + 1) * 10000) / 10000;
			var share = 360 / colors;
			
			for (var s = step ; s <= (100-step/2); s += step) {
				for (var i = 0; i < colors; i++) {
					html += '<div data-s="'+s+'" style="background-color:' + fx.hsv2rgb(i * share, s, 100) + ';"></div>';
				}
				html += '<div style="background-color:' + fx.hsv2rgb(0, 0, 100 - (s / step - 1) * 16.7) + ';"></div><br />';
			}
			for (var v = 100 - step * ((steps + 1) % 2)/2; v >= step/2; v -= step) {
				for (var i = 0; i < colors; i++) {
					html += '<div data-v="'+v+'" style="background-color:' + fx.hsv2rgb(i * share, 100, v) + ';"></div>';
				}
				html += '<div style="background-color:' + fx.hsv2rgb(0, 0, (v / step - 1) * 16.7) + ';"></div><br />';
			}
			
			html += '</div>';
			
			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			var items = $(this).attr('data-item').explode();
			var actualSteel = steel[this.id];
			var off = $(this).attr('data-val-off');
			
			$(html).popup({ theme: "a", overlayTheme: "a", positionTo: this }).popup("open")
			.on("popupafterclose", function() { $(this).remove(); })
			.children('div').on( {
				'click': function (event) {
					var rgb = $(this).css('background-color');
					rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
									
					if(rgb[1] == 0 && rgb[2] == 0 && rgb[3] == 0)
					{
						actualSteel.setAlpha(0.5);
						io.write(items[3], off);
					}
					else
					{
						actualSteel.setAlpha(100);
						io.write(items[0], Math.round(rgb[1] / 255 * (max - min)) + min);
						io.write(items[1], Math.round(rgb[2] / 255 * (max - min)) + min);
						io.write(items[2], Math.round(rgb[3] / 255 * (max - min)) + min);
					}
					
					
					$(this).parent().popup('close');
				},
				
				'mouseenter': function (event) {
					$(this).addClass("ui-focus");
				},
				
				'mouseleave': function (event) {
					$(this).removeClass("ui-focus");
				}
			});
		}
	})
	// colors on disc (as former basic.colordisc)
	.end().filter('canvas[data-style="disc"]').on( {
		'click': function (event) {
			var canvas = $('<canvas style="border: none;">')
			
			var size = 280;
			var colors = parseInt($(this).attr('data-colors'));
			var steps = parseInt($(this).attr('data-step'));
			var step = Math.round(2 * 100 / (steps + 1) * 10000) / 10000;
	
			var arc = Math.PI / (colors + 2) * 2;
			var startangle = arc - Math.PI / 2;
			var gauge = (size - 2) / 2 / (steps + 1);
			var share = 360 / colors;
			var center = size / 2;
	
			if (canvas[0].getContext) {
				var ctx = canvas[0].getContext("2d");
				ctx.canvas.width = size;
				ctx.canvas.height = size;
				canvas.width(size).height(size);
	
				// draw background
				ctx.beginPath();
				ctx.fillStyle = '#888';
				ctx.shadowColor = 'rgba(96,96,96,0.4)';
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 4;
				ctx.arc(center, center, size / 2 - 1, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.beginPath();
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
				ctx.shadowBlur = 0;
				ctx.fillStyle = '#555';
				ctx.arc(center, center, size / 2 - 2, 0, 2 * Math.PI, false);
				ctx.fill();
	
				// draw colors
				for (var i = 0; i <= colors; i++) {
					var angle = startangle + i * arc;
					var ring = 1;
					var h = i * share;
					for (var v = step; v <= 100 - step/2; v += step) {
						ctx.beginPath();
						ctx.fillStyle = fx.hsv2rgb(h, 100, v);
						ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
						ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
						ctx.fill();
						ring += 1;
					}
					for (var s = (100 - step * ((steps + 1) % 2)/2); s >= step/2; s -= step) {
						ctx.beginPath();
						ctx.fillStyle = fx.hsv2rgb(h, s, 100);
						ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + arc + 0.01, false);
						ctx.arc(center, center, ring * gauge, angle + arc + 0.01, angle, true);
						ctx.fill();
						ring += 1;
					}
				}
	
				// draw grey
				angle = startangle - 2 * arc;
				ring = 1;
				h = i * share;
				for (var v = step; v <= 100; v += (step / 2)) {
					ctx.beginPath();
					ctx.fillStyle = fx.hsv2rgb(h, 0, v);
					ctx.arc(center, center, ring * gauge + gauge + 1, angle, angle + 2 * arc + 0.01, false);
					ctx.arc(center, center, ring * gauge, angle + 2 * arc + 0.01, angle, true);
					ctx.fill();
					ring += 1;
				}
	
				// draw center
				ctx.beginPath();
				ctx.fillStyle = 'rgb(0,0,0)';
				ctx.arc(center, center, gauge + 1, 0, 2 * Math.PI, false);
				ctx.fill();
			
			}
					
			var max = parseFloat($(this).attr('data-max'));
			var min = parseFloat($(this).attr('data-min'));
			var items = $(this).attr('data-item').explode();
			var actualSteel = steel[this.id];
			var off = $(this).attr('data-val-off');
			
			// event handler on color select
			canvas.popup({ theme: 'none', overlayTheme: 'a', shadow: false, positionTo: this }).popup("open")
			.on( {
				'popupafterclose': function() { $(this).remove(); },
				'click': function (event) {
					var offset = $(this).offset();
					var x = Math.round(event.pageX - offset.left);
					var y = Math.round(event.pageY - offset.top);

					var rgb = canvas[0].getContext("2d").getImageData(x, y, 1, 1).data;
					// DEBUG: console.log([rgb[0], rgb[1], rgb[2], rgb[3]]);
					
					if(rgb[3] > 0) { // set only, if selected color is not transparent
						if(rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0)
						{
							actualSteel.setAlpha((Math.round(rgb[3] / 255 * (max - min)) + min) / 255);
							io.write(items[3], off);
						}
						else
						{
							actualSteel.setAlpha((Math.round(rgb[3] / 255 * (max - min)) + min) / 255);
							io.write(items[0], Math.round(rgb[0] / 255 * (max - min)) + min);
							io.write(items[1], Math.round(rgb[1] / 255 * (max - min)) + min);
							io.write(items[2], Math.round(rgb[2] / 255 * (max - min)) + min);
						}
					}
										
					$(this).popup("close");
				}
			});

		}
	});
	
	// ----- steel.led ------------------------------------------------------
	$(bevent.target).find('canvas[data-widget="steel.led"]').on( {
		'update': function (event, response) {
			event.stopPropagation();
			
			//debug: console.log("[steel.led] '" + this.id + "' update: " + response);
			
			var values = $(this).attr('data-values') && $(this).attr('data-values').explode().length == 7 ? $(this).attr('data-values').explode() : [0,1,2,3,4,5,6];			
			steel[this.id] = new steelseries.Led(this.id, {width: 200, height: 200});			
			           // 0=red,    1=green,    2=blue,   3=orange,      4=yellow,    5=cyan,    6=magenta
			var color = ['RED_LED','GREEN_LED','BLUE_LED','ORANGE_LED','YELLOW_LED','CYAN_LED','MAGENTA_LED'];
			
			for (var i = 0; i < values.length; i++) {
				if (values[i] == response[0])
				{
					steel[this.id].setLedColor(steelseries.LedColor[color[i]]);
				}
			}
			
			if (response[1]) {
				$(this).val(response[1]);			
				$(this).val() == $(this).attr('data-val-off') ? steel[this.id].setLedOnOff(0) :  steel[this.id].setLedOnOff(1);
			}
		},
		'click': function(event){
			event.stopPropagation();
			
			$(this).val() == $(this).attr('data-val-off') ? steel[this.id].setLedOnOff(1) :  steel[this.id].setLedOnOff(0);	

			io.write($(this).attr('data-switch'), ($(this).val() == $(this).attr('data-val-off') ? $(this).attr('data-val-on') : $(this).attr('data-val-off')) );
		}
	});
});
