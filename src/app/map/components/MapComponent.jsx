import React, {useState, useRef, useEffect} from 'react';
import {Autocomplete, DrawingManager, GoogleMap, Polygon, useLoadScript} from "@react-google-maps/api";
import {Skeleton} from "@nextui-org/skeleton";
import Notification from "@/app/map/components/Notification";
import PdfGenerator from "@/app/map/components/PdfGenerator ";
import CursorSVG from "@/app/map/components/CursorSVG";
import formatResponseData from "@/app/map/components/ResponseFormat";

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    marginBottom: '100px',
    position: 'relative'
};

const center = {
    lat: 50.330228, lng: 26.239297
};

const libraries = ['places', 'drawing'];

function MapComponent() {

    const [cropPolygons, setCropPolygons] = useState([]);
    const [cropColor, setCropColor] = useState('green');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState('');
    const [map, setMap] = useState(null);
    const [triggerDownload, setTriggerDownload] = useState(false);
    const [responseData, setResponseData] = useState(null);


    const [displayResponse, setDisplayResponse] = useState('');
    const [completedTyping, setCompletedTyping] = useState(true);
    const responseContainerRef = useRef(null);


    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, libraries,
    });
    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
        map.setCenter(new window.google.maps.LatLng(center.lat, center.lng));
        map.setZoom(14);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();

        if (place.geometry && map) {
            const center = place.geometry.location;
            map.setCenter(center);
            map.setZoom(16);
        } else {
            console.log("No details available for input: '" + place.name + "'");
        }
    };

    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (responseData) {
            setCompletedTyping(false);

            let i = 0;
            const stringResponse = JSON.stringify(responseData, null, 2);

            const intervalId = setInterval(() => {
                let formattedResponse = formatResponseData(responseData)
                setDisplayResponse(formattedResponse.slice(0, i));

                i++;

                if (i > stringResponse.length) {
                    clearInterval(intervalId);
                    setCompletedTyping(true);
                    responseContainerRef.current?.scrollTo(0, responseContainerRef.current.scrollHeight);
                }
            }, 20);

            return () => clearInterval(intervalId);
        }
    }, [responseData]);

    if (loadError) return (
        <div>Error loading maps</div>
    );
    if (!isLoaded) return (
        <Skeleton className="w-[100%] h-[600px]"/>
    );

    const transformCoordinates = (coords) => {
        if (!Array.isArray(coords)) {
            return [];
        }

        return coords.map(([lng, lat]) => {
            return {lat: lat, lng: lng}
        });
    };

    const showErrorNotification = (error) => {
        setNotification(error);
        setTimeout(() => {
            setNotification('');
        }, 5000);
    };

    const onPolygonComplete = polygon => {
        polygon.setMap(null);
        setResponseData(null);
        setTriggerDownload(false);
        setIsLoading(true);
        const coordinates = (polygon.getPath().getArray().map(coord => [coord.lng(), coord.lat()]));
        console.log(coordinates)
        fetch('http://127.0.0.1:8000/api/polygon/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({coordinates: coordinates})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server responded with an error: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setIsLoading(false);
                polygon.setMap(null);
                if (data?.crop && Array.isArray(data?.crop) && data?.crop?.length > 0) {
                    setCropColor('green')
                    setCropPolygons(transformCoordinates(data?.crop));
                }
                if (Array.isArray(data?.crop) && data?.crop?.length === 0) {
                    setCropColor('red')
                    setCropPolygons(transformCoordinates(coordinates));
                }
                setResponseData(data);
                setTriggerDownload(true);
            })
            .catch(error => {
                    setResponseData(null);
                    setTriggerDownload(false);
                    setIsLoading(false);
                    console.error('Error:', error);
                    setNotification(error.message)
                    polygon.setMap(null);
                    showErrorNotification(error.message);
                }
            );
    };

    return (
        <>
            <div className="container-map-page">
                <div className="map-container relative" style={mapContainerStyle}>
                    <Autocomplete
                        onLoad={ref => autocompleteRef.current = ref}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder="Search places..."
                            style={{
                                width: "300px",
                                height: "40px",
                                paddingLeft: "10px",
                                color: "black",
                                backgroundColor: "white",
                                border: "1px solid #ccc"
                            }}
                        />
                    </Autocomplete>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={14}
                        mapTypeId={google.maps.MapTypeId.HYBRID}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
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
                                    strokeWeight: 1,
                                    clickable: true,
                                    editable: true,
                                    zIndex: 1
                                }
                            }}
                        />
                        {isLoading && (
                            <div className="loading-overlay">
                                <div className="spinner"></div>
                            </div>
                        )}
                        {renderPolygons(cropPolygons, cropColor)}
                    </GoogleMap>
                    <Notification message={notification} onClose={() => setNotification('')}/>
                    <div className="response-container relative"
                         style={{
                             maxHeight: '600px',
                             overflowY: 'auto',
                             width: '100%',
                             backgroundColor: 'rgb(18,18,19)',
                             border: '2px solid #e5e0e0',
                             color: 'rgba(222,216,216,0.85)',
                             borderRadius: '10px',
                             padding: '20px',
                             marginTop: '20px',
                             boxSizing: 'border-box'
                         }}>
                        <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0}}>
                            {displayResponse}
                        </pre>
                        {!completedTyping && <CursorSVG/>}
                    </div>
                </div>

                {/*{triggerDownload && (*/}
                {/*    <PdfGenerator data={responseData} triggerDownload={triggerDownload} />*/}
                {/*)}*/}
            </div>
        </>
    );

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
        } else {
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
