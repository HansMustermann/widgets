# widgets
Widgets for newest smartVisu Version 2.9 (develop) based on Highcharts and steelseries.

For the gauge widget you have to include **modules/solid-gauge.js** from Highcharts library.

!!! Widgets based on Highcharts (diagram and gauge) now included in smartVisu Version 2.9 develop !!!

For steelseries widget you have to include **steelseries.js** and **tween.js** from [SteelSeries](https://github.com/HanSolo/SteelSeries-Canvas)

A fixed version of **steelseries.js** with working *radialBargraph* can be found here [Fix](https://github.com/HansMustermann/SteelSeries-Canvas)
 
For the correct display of all data an units you have to add the **ini files** from lang folder in this repository to your smartVisu lang folder.
On the smartVisu configuration site you must select one of these language files, e.g. *Deutsch (Einheiten)*
<br />
<br />
**Gauge widget**
```
{% import "gauge.html" as gauge %}
{{ gauge.solid('Solid1', 'Solid_1', 10, 30, '°', 'Temperatur', '', [0.4,0.6,0.7], ['#55BF3B','#DDDF0D','#DF5353']) }}
{{ gauge.solid('Solid2', 'Solid_2', 10, 30, '°', 'Temperatur', 'cshape', [0.4,0.6,0.7], ['#55BF3B','#DDDF0D','#DF5353']) }}
{{ gauge.solid('Solid3', 'Solid_3', 10, 30, '°', 'Temperatur', 'circle', [0.4,0.6,0.7], ['#55BF3B','#DDDF0D','#DF5353']) }}
```
![Solid gauge](https://cloud.githubusercontent.com/assets/25583254/22646863/bf53c0a2-ec6e-11e6-8599-fdb392d68329.jpg)
```
{% import "gauge.html" as gauge %}
{{ gauge.angular('Speedometer', 'Speedometer_1', 10, 30, '°', '', '', '#DA6349') }}
{{ gauge.angular('Scale', 'Scale_1', 10, 30, '°', '', 'scale', '#DA6349') }}
```
![Speedometer](https://cloud.githubusercontent.com/assets/25583254/22646867/c5e73066-ec6e-11e6-8727-14efe20eb22f.JPG)
```
{% import "gauge.html" as gauge %}
{{ gauge.vumeter('VUmeter', ['VU_1','VU_2'], 0, 300) }}
```
![vumeter](https://cloud.githubusercontent.com/assets/25583254/22646876/d10ebaea-ec6e-11e6-96c2-a716c1fe9938.JPG)

**Diagram widget**
```
{% import "diagram.html" as diagram %}
{{ diagram.pie('Pie', ['Pie_1','Pie_2','Pie_3'], ['Pie1','Pie2','Pie3'], ['#FF0000','#FFFFFF','#000000']) }}
```
![pie](https://cloud.githubusercontent.com/assets/25583254/22646871/ca91e732-ec6e-11e6-986e-fa6a5aa26b99.JPG)

**SteelSeries widget**
```
{% import "steelseries.html" as steelseries %}
{{ steelseries.radial_odometer('Radial1', 'Radial1_value', 'Radial1_threshold', 'Radial1_odmeter', 0, 100, '%', 'Luftfeuchtigkeit', '', [4,'TURNED',1,'CHROME','true','BLUE','true','YELLOW',9,'GREEN','','',2], [true], [true]) }}
```
![SteelSeries1](https://cloud.githubusercontent.com/assets/25583254/22647562/9286c73c-ec72-11e6-832a-d1a2d07d4f8f.JPG)
```
{% import "steelseries.html" as steelseries %}
{{ steelseries.linear_threshold('Linear1', 'Linear1_value', 'Linear1_threshold', 0, 100, '%', 'Luftfeuchtigkeit', ['bargraph'], ['1','SATIN_GRAY','CHROME','false','BLUE','true','YELLOW','BLUE','true'], [true]) }}
{{ steelseries.display('Display1', 'Display1_value', '%', '', 'YELLOW') }}
```
![SteelSeries1](https://cloud.githubusercontent.com/assets/25583254/22647565/956aff22-ec72-11e6-8ce7-fddb53aeb13b.JPG)
