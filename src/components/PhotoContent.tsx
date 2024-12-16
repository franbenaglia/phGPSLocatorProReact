import { IonCard, IonCardHeader, IonCardContent, IonIcon } from '@ionic/react';
import './PhotoContent.css';
import { closeCircle } from 'ionicons/icons';
import { useContext } from 'react';
import { MapContext } from '../contexts/MapContext';
import { UserPhoto } from '../model/userPhoto';

interface ContainerProps {
    photo: UserPhoto;
}

const PhotoContent: React.FC<ContainerProps> = ({ photo }) => { //image= coordinate.photo.base64Data

    const { setOpenPhotoContent } = useContext(MapContext);

    const close = () => {
        setOpenPhotoContent(false);
    }

    return (
        <div>

            <IonCard>
                <IonCardHeader>
                    <IonIcon icon={closeCircle} size="large" onClick={() => close()}></IonIcon>
                </IonCardHeader>
                <IonCardContent>
                    <img src={photo.base64Data as string} />
                </IonCardContent>
            </IonCard>

        </div >
    );
};

export default PhotoContent;