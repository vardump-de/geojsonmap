# geojsonmap plugin for Craft CMS 3.x

A craft cms 3 field plugin to draw Leaflet Maps.

![Screenshot](resources/img/screenshot.png)

## Requirements

This plugin requires Craft CMS 3.0.0-beta.23 or later.

## Installation

To install the plugin, follow these instructions.

1. Open your terminal and go to your Craft project:

        cd /path/to/project

2. Then tell Composer to load the plugin:

        composer require vardump/geojsonmap

3. In the Control Panel, go to Settings → Plugins and click the “Install” button for geojsonmap.

## Display in frontend

```
<link href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" rel="stylesheet"/>
<script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"></script>
                
<div id="map" style="height: 500px;"></div>  
<div id="geojson" style="display: none">{{ entry.geojsonField }}</div>

<script>
// Create the map
var map = L.map(document.getElementById('map')).setView([47.9034, 8.10577], 10);
  
// Set up the OSM layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Data ©<a href="http://osm.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(map);

// Create featureGroup
var layer = L.featureGroup().addTo(map);

// Draw Geojson
var geojson = document.getElementById('geojson');
if (geojson.innerHTML) {
    var geojsonLayer = L.geoJson(JSON.parse(geojson.innerHTML))
    geojsonLayer.eachLayer(function (l) {
      layer.addLayer(l)
    })
    map.fitBounds(layer.getBounds())
}
</script>                           
```

![Screenshot](resources/img/plugin-logo.png)

Brought to you by [vardump.de](https://vardump.de)
