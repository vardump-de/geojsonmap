/**
 * geojsonmap plugin for Craft CMS
 *
 * GeojsonmapField Field JS
 *
 * @author    Andi Grether
 * @copyright Copyright (c) 2019 Andi Grether
 * @link      https://webworker.me/
 * @package   Geojsonmap
 * @since     1.0.0 GeojsonmapField
 */

const Geojsonmap = function (fieldID, centerLat, centerLng, mapHeight, mapZoom) {

  const self = this

  // Vars
  self.mapelement = document.getElementById(fieldID + '-map')
  self.textarea = document.getElementById(fieldID)
  self.tools = document.getElementById(fieldID + '-tools')
  self.textareaWrapper = document.getElementById(fieldID + '-input-wrapper')
  self.downloadButton = document.getElementById(fieldID + '-download')
  self.toggleButton = document.getElementById(fieldID + '-toggle')
  self.center = [centerLat, centerLng]
  self.zoom = mapZoom

  // Build Map
  self.mapelement.style.height = mapHeight + 'px'

  self.map = L.map(self.mapelement, {
    fullscreenControl: true
  }).setView(self.center, self.zoom)

  // Set up the OSM layer
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(self.map)

  // Add featureGroup for drawn items
  self.drawnItems = L.featureGroup().addTo(self.map)
  new L.Control.Draw({
    draw: {
      circle: false
    },
    edit: {
      featureGroup: self.drawnItems,
      edit: true,
      allowIntersection: true
    }
  }).addTo(self.map)

  // Draw from GeoJson
  if (self.textarea.value) {
    self.tools.setAttribute('data-state', true)
    const geojsonLayer = L.geoJson(JSON.parse(self.textarea.value))
    geojsonLayer.eachLayer(function (l) {
      self.drawnItems.addLayer(l)
    })
    self.map.fitBounds(geojsonLayer.getBounds())
  }

  // Draw events
  this.map.on('draw:created', function (e) {
    self.drawnItems.addLayer(e.layer)
    self.addGeoJsonToField()
  })
  this.map.on('draw:edited', function (e) {
    self.addGeoJsonToField()
  })
  this.map.on('draw:deleted', function (e) {
    self.addGeoJsonToField()
  })

  // Download Button
  self.downloadButton.addEventListener('click', function () {
    // Extract GeoJson from featureGroup
    const data = self.drawnItems.toGeoJSON()
    // Stringify the GeoJson
    const convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
    // Create export
    self.downloadButton.setAttribute('href', 'data:' + convertedData)
    self.downloadButton.setAttribute('download', 'mapdata.geojson')
  })

  // Toggle Button
  self.toggleButton.addEventListener('click', function (e) {
    e.preventDefault()
    if (self.textareaWrapper.getAttribute('aria-expanded') === 'true') {
      self.toggleButton.setAttribute('data-state', 'false')
      self.textareaWrapper.setAttribute('aria-expanded', 'false')
    } else {
      self.toggleButton.setAttribute('data-state', 'true')
      self.textareaWrapper.setAttribute('aria-expanded', 'true')
    }
  })

  // Re-draw map on tab change
  if (document.getElementById('tabs')) {
    [].slice.call(
      document.getElementById('tabs').getElementsByTagName('a')
    ).map(function (el) {
      el.addEventListener('click', function () {
        self.map.invalidateSize(false)
        const data = self.drawnItems.toGeoJSON()
        if (data.features && data.features.length) {
          self.map.fitBounds(self.drawnItems.getBounds())
        }
      })
    })
  }

  // Write GeoJson to textarea
  this.addGeoJsonToField = function () {
    const data = self.drawnItems.toGeoJSON()
    if (data.features && data.features.length) {
      self.tools.setAttribute('data-state', true)
      self.textarea.value = JSON.stringify(data)
    } else {
      self.tools.setAttribute('data-state', false)
      self.toggleButton.setAttribute('data-state', 'false')
      self.textareaWrapper.setAttribute('aria-expanded', 'false')
      self.textarea.value = ''
    }
  }
}
