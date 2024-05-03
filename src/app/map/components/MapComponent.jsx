import React, {useState, useEffect} from 'react';
import {GoogleMap, DrawingManager, useLoadScript, Polygon} from "@react-google-maps/api";


const mapContainerStyle = {
    width: '100%', height: '600px'
};

const center = {
    lat: 50.330228, lng: 26.239297
};

const libraries = ['drawing'];

function MapComponent() {

    const [cropPolygons, setCropPolygons] = useState([]);
    const [fPolygons, setfPolygons] = useState([]);
    const [ePolygons, setePolygons] = useState([]);
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, libraries,
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    // const transformCoordinates = (coords) => {
    //     if (!Array.isArray(coords)) {
    //         console.error("Expected an array of coordinates, received:", coords);
    //         return [];
    //     }
    //
    //     return coords.map(polygon => {
    //         // if (!Array.isArray(polygon) || polygon.some(coord => !Array.isArray(coord) || coord.length !== 2)) {
    //         //     console.error("Invalid polygon data:", polygon);
    //         //     return [];
    //         // }
    //
    //         return polygon.map(([lng, lat]) => ({
    //             lat: lat, lng: lng
    //         }));
    //     });
    // };

    const transformCoordinates = (coords) => {
        if (!Array.isArray(coords)) {
            console.error("Expected an array of coordinates, received:", coords);
            return [];
        }

        return coords.map(polygon => {
            if (!Array.isArray(polygon)) {
                console.error("Expected a polygon to be an array, received:", polygon);
                return []; // Returning an empty array for this polygon as it's not in expected format
            }

            return polygon.map(coord => {
                if (!Array.isArray(coord) || coord.length !== 2) {
                    console.error("Expected coordinate to be an array of two elements, received:", coord);
                    return null; // Returning null for individual coordinates that do not conform
                }
                const [lng, lat] = coord;
                if (typeof lng !== 'number' || typeof lat !== 'number') {
                    console.error("Coordinates must be numbers, received:", coord);
                    return null;
                }
                return { lat, lng };
            }).filter(coord => coord !== null); // Filter out any invalid coordinates
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
                if (data.crop && Array.isArray(data.crop)) {
                    setCropPolygons(transformCoordinates(data.crop));
                }
                if (data.f && Array.isArray(data.f)) {
                    setfPolygons(transformCoordinates(data.f));
                }
                if (data.e && Array.isArray(data.e)) {
                    setePolygons(transformCoordinates(data.e));
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
                    strokeWeight: 2,
                    clickable: true,
                    editable: true,
                    zIndex: 1
                }
            }}
        />
        {renderPolygons(cropPolygons, 'green')}
        {renderPolygons(fPolygons, 'blue')}
        {renderPolygons(ePolygons, 'red')}
    </GoogleMap>);

    function renderPolygons(polygons, color) {
        return polygons.map((path, index) => (<Polygon
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
            />));
    }
}

export default MapComponent;
