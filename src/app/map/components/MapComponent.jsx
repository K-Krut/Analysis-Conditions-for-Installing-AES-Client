import React, {useState, useRef, useEffect} from 'react';
import {Autocomplete, DrawingManager, GoogleMap, Polygon, useLoadScript} from "@react-google-maps/api";
import {Skeleton} from "@nextui-org/skeleton";
import Notification from "@/app/map/components/Notification";
import PdfGenerator from "@/app/map/components/PdfGenerator";
import CursorSVG from "@/app/map/components/CursorSVG";
import formatResponseData from "@/app/map/components/ResponseFormat"
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';


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
    const [shouldGeneratePdf, setShouldGeneratePdf] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleToggle = () => {
        setChecked(!checked);
    };

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
    const handleDownloadClick = () => {
        if (triggerDownload && !isDownloading) {
            setIsDownloading(true);
            setShouldGeneratePdf(true);
        }
    };

    const handleDownloadCompleted = () => {
        setIsDownloading(false);
        setShouldGeneratePdf(false);
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
                }
            }, 16);

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

    const ColorSwitch = styled(Switch)(({ theme, checked }) => ({
        width: 100,
        height: 34,
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: checked ? 'grey' : 'yellow',
            transform: 'translateX(70px)',
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: checked ? 'grey' : 'yellow',
        },
        '& .MuiSwitch-thumb': {
            width: 24,
            height: 24,
        },
        '& .MuiSwitch-switchBase': {
            padding: 6,
        },
        '& .MuiSwitch-track': {
            borderRadius: 20 / 2,
            opacity: 1,
            backgroundColor: 'rgba(204,122,27,0.58)',
        },
    }));

    const onPolygonComplete = polygon => {
        polygon.setMap(null);
        setResponseData(null);
        setTriggerDownload(false);
        setCompletedTyping(true)
        setDisplayResponse('')
        setIsLoading(true);
        const coordinates = (polygon.getPath().getArray().map(coord => [coord.lng(), coord.lat()]));
        console.log(coordinates)
        fetch('http://127.0.0.1:8000/api/polygon/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({coordinates: coordinates, type: checked ? "wind" : "solar"})
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
                <div className="toggle-container">
                    <div className="label" style={{ color: 'grey', fontSize: '20px'}}>
                        {checked ? 'Wind' : 'Solar'}
                    </div>
                    <ColorSwitch
                        onChange={handleToggle}
                        inputProps={{ 'aria-label': 'controlled' }}
                        size="large"
                        checked={checked}
                    />
                </div>
                <div className="map-container relative" style={mapContainerStyle}>
                    <Autocomplete
                        onLoad={ref => autocompleteRef.current = ref}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder="Search places..."
                            style={{
                                width: "400px",
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
            </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">Analysis Report</h1>
                    <a href="#" onClick={handleDownloadClick} style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: triggerDownload ? '#ADB7BE' : '#686868',
                        fontSize: '16px',
                        pointerEvents: triggerDownload ? 'all' : 'none',
                        opacity: triggerDownload ? 1 : 0.5
                    }}>
                        Download Report
                        <img
                            src={'/images/pdfIcon.png'}
                            alt="PDF icon"
                            style={{
                                marginRight: '8px',
                                height: '60px',
                                width: 'auto'
                            }}/>
                    </a>
                </div>
                {shouldGeneratePdf &&
                    <PdfGenerator
                        data={responseData}
                        shouldGeneratePdf={shouldGeneratePdf}
                        onDownloadCompleted={handleDownloadCompleted}
                    />}

                <div className="response-container relative"
                     style={{
                         maxHeight: '600px',
                         minHeight: '80px',
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
                    {isLoading && (
                        <div className="" style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            right: '20px',
                            bottom: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div className="spinner"></div>
                        </div>
                    )}
                    {!isLoading && !displayResponse && (
                        <div style={{
                            textAlign: 'center',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>Here will be your report details</div>
                    )}
                    {displayResponse && <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0}}>
                            {displayResponse}
                        </pre>}
                    {!completedTyping && <CursorSVG/>}
                </div>
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
