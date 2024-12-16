import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './PhotoAlbumPage.css';
import PhotoAlbum from '../components/PhotoAlbum';

const PhotoAlbumPage: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Photo Album</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Photo Album</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <PhotoAlbum />
            </IonContent>
        </IonPage>
    );
};

export default PhotoAlbumPage;
