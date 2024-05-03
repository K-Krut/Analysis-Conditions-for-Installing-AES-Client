import React, {useState} from 'react';
import {DrawingManager, GoogleMap, Polygon, useLoadScript} from "@react-google-maps/api";


const mapContainerStyle = {
    width: '100%', height: '600px'
};

const center = {
    lat: 50.330228, lng: 26.239297
};

const libraries = ['drawing'];

function MapComponent() {

    const [cropPolygons, setCropPolygons] = useState([]);
    const [cropColor, setCropColor] = useState('green');
    const [fPolygons, setfPolygons] = useState([]);
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, libraries,
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    const transformCoordinates = (coords) => {
        if (!Array.isArray(coords)) {
            return [];
        }

        return coords.map(([lng, lat]) => {
            return {lat: lat, lng: lng}
        });
    };

    const onPolygonComplete = polygon => {
        const coordinates = (polygon.getPath().getArray().map(coord => [coord.lng(), coord.lat()]));
        console.log(coordinates)
        fetch('http://127.0.0.1:8000/api/polygon/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({coordinates: coordinates})
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                polygon.setMap(null);
                if (data.crop && Array.isArray(data.crop) && data.crop.length > 0) {
                    setCropColor('green')
                    setCropPolygons(transformCoordinates(data.crop));
                }
                if (Array.isArray(data.crop) && data.crop.length === 0) {
                    setCropColor('red')
                    setCropPolygons(transformCoordinates(coordinates));
                }
                if (data.f && Array.isArray(data.f)) {
                    setfPolygons(transformCoordinates(data.f));
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (<GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
    >
        <DrawingManager
            onPolygonComplete={onPolygonComplete}
            options={{
                drawingControl: true, drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER, drawingModes: ['polygon']
                },
                polygonOptions: {
                    fillColor: '#676560',
                    fillOpacity: 0.7,
                    strokeWeight: 0.5,
                    clickable: true,
                    editable: true,
                    zIndex: 1
                }
            }}
        />
        {renderPolygons(cropPolygons, cropColor)}
        {renderPolygons(fPolygons, 'blue')}
    </GoogleMap>);

    function renderPolygons(polygons, color) {
        if (Array.isArray(polygons[0])) {
            return polygons.map((path, index) => (
                <Polygon
                    key={`${color}-${index}`}
                    paths={path}
                    options={{
                        fillColor: color,
                        fillOpacity: 0.5,
                        strokeWeight: 2,
                        clickable: true,
                        editable: false,
                        zIndex: 1
                    }}
                />
            ));
        }  else {
            return <Polygon
                key={`${color}`}
                paths={polygons}
                options={{
                    fillColor: color,
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                    clickable: true,
                    editable: false,
                    zIndex: 1
                }}
            />
        }
    }
}

export default MapComponent;
