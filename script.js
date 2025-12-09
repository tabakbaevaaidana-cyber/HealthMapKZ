// Карта жасау
const map = L.map('mapid').setView([48.0, 66.9], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Қауіп деңгейін түске бөлу
function getColor(risk) {
  if (risk < 30) return 'green';
  if (risk < 70) return 'orange';
  return 'red';
}

// Кездейсоқ қауіптілік
function randomRisk() { return Math.floor(Math.random() * 100); }

let geoLayer;

// GeoJSON файлын жүктеу (data/KZ_ADM1.geojson)
fetch('./data/KZ_ADM1.geojson')
  .then(res => res.json())
  .then(geojson => {
    geojson.features.forEach(f => f.properties.risk = randomRisk());
    geoLayer = L.geoJSON(geojson, {
      style: feature => ({
        color: getColor(feature.properties.risk),
        fillColor: getColor(feature.properties.risk),
        fillOpacity: 0.5,
        weight: 1
      }),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`${feature.properties.name} — қауіптілік: ${feature.properties.risk}%`);
      }
    }).addTo(map);
    window.geojsonData = geojson;
  });

// Карту жаңарту батырмасы
function updateMap() {
  if (!window.geojsonData) return;
  window.geojsonData.features.forEach(f => f.properties.risk = randomRisk());
  map.removeLayer(geoLayer);
  geoLayer = L.geoJSON(window.geojsonData, {
    style: feature => ({
      color: getColor(feature.properties.risk),
      fillColor: getColor(feature.properties.risk),
      fillOpacity: 0.5,
      weight: 1
    }),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`${feature.properties.name} — қауіптілік: ${feature.properties.risk}%`);
    }
  }).addTo(map);
}

// Қоғам модулі — симптомдар тізімі
function addSymptom() {
  const input = document.getElementById('symptom');
  const val = input.value.trim();
  if (val) {
    const ul = document.getElementById('symptomList');
    const li = document.createElement('li');
    li.textContent = val;
    ul.appendChild(li);
    input.value = '';
  }
}
