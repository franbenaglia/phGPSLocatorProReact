import { useEffect, useState } from 'react';
import './Photo.css';
import { deletePhoto, getPhotos } from '../helper/StorageHelper';
import { UserPhoto } from '../model/userPhoto';
import { usePhotoGallery } from '../hooks/userPhotoGallery';
import { IonCol, IonFab, IonFabButton, IonFabList, IonGrid, IonIcon, IonImg, IonRow, IonToast, useIonActionSheet } from '@ionic/react';
import { camera, chevronForwardCircle, colorPalette, globe, image, document } from 'ionicons/icons';

interface ContainerProps {
    name: string;
}

const urllocalserver = import.meta.env.VITE_URL_LOCAL_SERVER;

const Photo: React.FC<ContainerProps> = ({ name }) => {

    const [photos, setPhotos] = useState([] as UserPhoto[]);

    const [isToastOpen, setIsToastOpen] = useState(false);

    const [present] = useIonActionSheet();

    useEffect(() => {

        getPhotos().subscribe(ps => {
            setPhotos(ps);
        })

        checkPermissions();

    }, []);

    const setOpen = (isOpen: boolean) => {
        setIsToastOpen(isOpen);
    }

    const checkPermissions = (): void => {

        usePhotoGallery().checkPermissions().subscribe(status => {
            console.log(status);
            if (status !== 'web' && (status.camera !== 'granted' || status.photos !== 'granted')) {
                setOpen(true);
            }
        });

    }

    const addPhotoToGallery = () => {
        checkPermissions();
        usePhotoGallery().addNewToGallery();
        window.location.assign(urllocalserver);

    }

    const addImageToGallery = () => {
        usePhotoGallery().addImageToGallery();
        window.location.assign(urllocalserver);
    }

    const showActionSheet = async (photo: UserPhoto, position: number) => {
        const actionSheet = await present({
            header: 'Photos',
            buttons: [{
                text: 'Delete',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    deletePhoto(photo);
                }
            }, {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
                handler: () => {

                }
            }]
        });
    }

    return (
        <div>
            <IonGrid>
                <IonRow>
                    {usePhotoGallery().photos && usePhotoGallery().photos.map((photo, position) => {
                        return (
                            <IonCol size="6" >
                                <IonImg src={photo.base64Data as string} onClick={() => showActionSheet(photo, position)}></IonImg>
                            </IonCol>
                        )
                    }
                    )
                    }
                </IonRow>
            </IonGrid>

            <IonFab vertical="bottom" horizontal="center" slot="fixed">
                <IonFabButton onClick={() => addPhotoToGallery()}>
                    <IonIcon icon={camera}></IonIcon>
                </IonFabButton >
                <IonFabButton onClick={() => addImageToGallery()}>
                    <IonIcon icon={image}></IonIcon >
                </IonFabButton>
            </IonFab>

            <IonFab slot="fixed" vertical="top" horizontal="start">
                <IonFabButton>
                    <IonIcon icon={chevronForwardCircle}></IonIcon>
                </IonFabButton>
                <IonFabList side="end">
                    <IonFabButton>
                        <IonIcon icon={document}></IonIcon>
                    </IonFabButton>
                    <IonFabButton>
                        <IonIcon icon={colorPalette}></IonIcon>
                    </IonFabButton>
                    <IonFabButton>
                        <IonIcon icon={globe}></IonIcon>
                    </IonFabButton>
                </IonFabList>
            </IonFab >
            <IonToast isOpen={isToastOpen} message="Lack of camera permission!!!" duration={5000}
                onDidDismiss={() => setOpen(false)}></IonToast>
        </div >
    );
};

export default Photo;









































