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
            <p>Lat: {coordinate.lat} Ln: {coordinate.lng} Date: {coordinate.date.toISOString()}</p>
            <img src={coordinate.photo.base64Data as string} />

        </div >
    );
};

export default PhotoAlbumContainer;