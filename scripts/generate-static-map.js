const fs = require('fs');
const path = require('path');

// Lire le fichier CSV
const csvContent = fs.readFileSync(path.join(__dirname, '../query_result.csv'), 'utf-8');
const rows = csvContent.split('\n').slice(1); // Ignorer l'en-tête

// Convertir les données CSV en points
const points = rows
  .filter(row => row.trim() !== '')
  .map(row => {
    const [latitude, longitude] = row.split(',').map(Number);
    return { latitude, longitude };
  });

// Générer le HTML statique
const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Carte des Points</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
    <style>
        body { margin: 0; }
        #map { height: 100vh; width: 100%; }
        .marker-cluster {
            background-color: rgba(241, 128, 23, 0.6);
        }
        .marker-cluster div {
            background-color: rgba(240, 194, 12, 0.6);
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
    <script>
        // Données des points
        const points = ${JSON.stringify(points)};
        
        // Initialiser la carte
        const map = L.map('map').setView([44.015618, 1.356086], 14);
        
        // Ajouter le fond de carte
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        // Créer un groupe de marqueurs
        const markers = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 16
        });
        
        // Ajouter les marqueurs au groupe
        points.forEach((point, idx) => {
            const marker = L.marker([point.latitude, point.longitude])
                .bindPopup('Point ' + (idx + 1));
            markers.addLayer(marker);
        });
        
        // Ajouter le groupe de marqueurs à la carte
        map.addLayer(markers);
    </script>
</body>
</html>
`;

// Écrire le fichier HTML
fs.writeFileSync(path.join(__dirname, '../public/map.html'), html);
console.log('Carte statique générée avec succès !'); 