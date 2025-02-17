import { IonCard, IonCardHeader, IonCardContent, IonIcon } from '@ionic/react';
import './PhotoAlbumContainer.css';
import { closeCircle } from 'ionicons/icons';
import { Coordinate } from '../model/coordinate';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface ContainerProps {
    coordinate: Coordinate;
}

const PhotoAlbumContainer: React.FC<ContainerProps> = ({ coordinate }) => {

    const [sdate, setSdate] = useState('');

    useEffect(() => {
        //console.log('la coordenada ' + coordinate.lat);
        //console.log(coordinate.lat);
        //console.log(coordinate.lng);
        //console.log(coordinate.date);
        setSdate(coordinate.date ? coordinate.date.toString() : 'no date');
    }, []);

    const photosrc = () => {
        if (!Capacitor.isNativePlatform()) {
            return coordinate.photo.base64Data;
        } else {
            return Capacitor.convertFileSrc(coordinate.photo.filepath);
        }
    }

    return (
        <div>
            <p>Lat: {coordinate.lat.toFixed(2)} Ln: {coordinate.lng.toFixed(2)}  Date: {sdate} </p>
            <img src={photosrc() as string} />

        </div >
    );
};

export default PhotoAlbumContainer;