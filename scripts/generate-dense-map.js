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
    <title>Carte Dense des Points</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />
    <style>
        body { margin: 0; }
        #map { height: 100vh; width: 100%; }
        .marker-cluster {
            background-color: rgba(241, 128, 23, 0.4);
        }
        .marker-cluster div {
            background-color: rgba(240, 194, 12, 0.4);
        }
        .marker-cluster-small {
            background-color: rgba(181, 226, 140, 0.6);
        }
        .marker-cluster-small div {
            background-color: rgba(110, 204, 57, 0.6);
        }
        .marker-cluster-medium {
            background-color: rgba(241, 211, 87, 0.6);
        }
        .marker-cluster-medium div {
            background-color: rgba(240, 194, 12, 0.6);
        }
        .marker-cluster-large {
            background-color: rgba(253, 156, 115, 0.6);
        }
        .marker-cluster-large div {
            background-color: rgba(241, 128, 23, 0.6);
        }
        .marker-cluster-huge {
            background-color: rgba(241, 128, 23, 0.8);
        }
        .marker-cluster-huge div {
            background-color: rgba(240, 12, 12, 0.8);
        }
        .custom-marker {
            position: relative;
            width: 0 !important;
            height: 0 !important;
        }
        .custom-marker::before {
            content: '';
            position: absolute;
            top: -20px;
            left: -10px;
            width: 20px;
            height: 20px;
            background-color: #ff0000;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
        }
        .custom-marker::after {
            content: '';
            position: absolute;
            top: -8px;
            left: -2px;
            width: 4px;
            height: 4px;
            background-color: #000;
            border-radius: 50%;
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
        
        // Créer une icône personnalisée pour les marqueurs individuels
        const customIcon = L.divIcon({
            className: 'custom-marker',
            iconSize: [0, 0],
            iconAnchor: [0, 0]
        });
        
        // Créer un groupe de marqueurs avec un clustering moins agressif
        const markers = L.markerClusterGroup({
            maxClusterRadius: 30,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 15,
            chunkedLoading: true,
            chunkInterval: 200,
            chunkDelay: 50,
            iconCreateFunction: function(cluster) {
                const count = cluster.getChildCount();
                let size = 'small';
                if (count > 2000) size = 'huge';
                else if (count > 100) size = 'large';
                else if (count > 50) size = 'medium';
                
                return L.divIcon({
                    html: '<div><span>' + count + '</span></div>',
                    className: 'marker-cluster marker-cluster-' + size,
                    iconSize: L.point(40, 40)
                });
            }
        });
        
        // Ajouter les marqueurs au groupe
        points.forEach((point, idx) => {
            const marker = L.marker([point.latitude, point.longitude], { icon: customIcon })
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
fs.writeFileSync(path.join(__dirname, '../public/dense-map.html'), html);
console.log('Carte dense générée avec succès !'); 