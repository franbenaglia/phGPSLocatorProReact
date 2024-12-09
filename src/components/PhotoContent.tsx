import { IonCard, IonCardHeader, IonCardContent, IonIcon } from '@ionic/react';
import './PhotoContent.css';
import { closeCircle } from 'ionicons/icons';

interface ContainerProps {
    image: string;
}

const PhotoContent: React.FC<ContainerProps> = ({ image }) => { //image= coordinate.photo.base64Data

    const close = () => {
        //dismissPopOverPicEvent.emit(true);
    }

    return (
        <div>

            <IonCard>
                <IonCardHeader>
                    <IonIcon icon={closeCircle} size="large" onClick={() => close()}></IonIcon>
                </IonCardHeader>
                <IonCardContent>
                    <img src={image} />
                </IonCardContent>
            </IonCard>

        </div >
    );
};

export default PhotoContent;