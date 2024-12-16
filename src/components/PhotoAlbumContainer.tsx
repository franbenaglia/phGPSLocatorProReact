import { IonCard, IonCardHeader, IonCardContent, IonIcon } from '@ionic/react';
import './PhotoAlbumContainer.css';
import { closeCircle } from 'ionicons/icons';
import { Coordinate } from '../model/coordinate';

interface ContainerProps {
    coordinate: Coordinate;
}

const PhotoAlbumContainer: React.FC<ContainerProps> = ({ coordinate }) => {

    return (
        <div>
            <p>Lat: {coordinate.lat.toFixed(2)} Ln: {coordinate.lng.toFixed(2)} Date: {coordinate.date.toUTCString()}</p>
            <img src={coordinate.photo.base64Data as string} />

        </div >
    );
};

export default PhotoAlbumContainer;