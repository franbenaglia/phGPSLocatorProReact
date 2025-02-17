import { IonCard, IonCardHeader, IonCardContent, IonIcon } from '@ionic/react';
import './PhotoContent.css';
import { closeCircle } from 'ionicons/icons';
import { useContext } from 'react';
import { MapContext } from '../contexts/MapContext';
import { UserPhoto } from '../model/userPhoto';
import { Capacitor } from '@capacitor/core';

interface ContainerProps {
    photo: UserPhoto;
}

const PhotoContent: React.FC<ContainerProps> = ({ photo }) => {

    const { setOpenPhotoContent } = useContext(MapContext);

    const close = () => {
        setOpenPhotoContent(false);
    }

    const photosrc = () => {
        if (!Capacitor.isNativePlatform()) {
            return photo.base64Data;
        } else {
            return Capacitor.convertFileSrc(photo.filepath);
        }
    }



    return (
        <div>

            <IonCard>
                <IonCardHeader>
                    <IonIcon icon={closeCircle} size="large" onClick={() => close()}></IonIcon>
                </IonCardHeader>
                <IonCardContent>
                    <img src={photosrc() as string} />
                </IonCardContent>
            </IonCard>

        </div >
    );
};

export default PhotoContent;