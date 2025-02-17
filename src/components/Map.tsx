import { useContext, useEffect, useState } from 'react';
import './Map.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
//import './leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { Coordinate } from '../model/coordinate';
import { IonContent, IonPopover } from '@ionic/react';
import { MapContext, MapProvider } from '../contexts/MapContext';
import MarkerContent from './MarkerContent';
import { getPositions, initSqlLite } from '../helper/StorageHelper';
import PhotoContent from './PhotoContent';
import { getCurrentPosition } from '../helper/GeolocHelper';
import { Capacitor } from '@capacitor/core';
import L from 'leaflet';


const Map: React.FC = () => {

    const [position, setPosition] = useState(null);
    const { isPopoverOpen, coordinate, coordinates, setCoordinates, openPhotoContent } = useContext(MapContext);

    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    const init = async () => {
        //if (Capacitor.isNativePlatform()) {
        //    await initSqlLite();
        //}
        cposition();
        fetchCoordinates();
    }

    const fetchCoordinates = async () => {
        getPositions().subscribe(cs => {
            console.log('SEEEEEEEEEETTTTTTTTTTEEEEEEEEANDO COOOOOORDS ' + cs);
            setCoordinates(cs)
        }
        );
    }

    useEffect(() => {
        init();
    }, []);

    const cposition = (): void => {
        getCurrentPosition().subscribe(p => {
            setPosition(prevposition => { return { lat: p.coords.latitude, lng: p.coords.longitude } });
        });
    }

    const ReLoad = () => {
        const map = useMapEvents({
            load: (e) => {
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            }
        });

        return null;
    }

    const LocationMarkers = () => {

        const { setIsPopoverOpen, setCoordinate } = useContext(MapContext);

        const map = useMapEvents({
            dblclick(e) {
                const c = { lat: e.latlng.lat, lng: e.latlng.lng } as Coordinate;
                setCoordinates([...coordinates, c])
            }
        });

        return (
            coordinates && coordinates.map((c, index) => {
                return <Marker position={{ lat: c.lat, lng: c.lng }} key={index}
                    eventHandlers={{
                        click: ($event) => {
                            console.log('marker clicked ' + c.lat + ' ' + c.lng);
                            setIsPopoverOpen((isPopoverOpen: any) => !isPopoverOpen);
                            setCoordinate(coordinates.find(c => c.lat === $event.latlng.lat && c.lng === $event.latlng.lng));
                        },
                    }}
                />
            }));
    }

    return (
        <>
            {position ? (
                <MapContainer center={position} zoom={12} scrollWheelZoom={false}

                    style={{
                        height: "550px", width: "100%", backgroundColor: "white", marginTop: "10px", marginBottom: '10px'
                    }}

                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationMarkers />

                </MapContainer>
            ) : ''
            }

            <IonPopover isOpen={isPopoverOpen} >
                <IonContent>
                    <MarkerContent coordinate={coordinate} />
                </IonContent>
            </IonPopover>

            <IonPopover isOpen={openPhotoContent} >
                <IonContent>
                    <PhotoContent photo={coordinate.photo} />
                </IonContent>
            </IonPopover>

        </>

    );
};

export default Map;



