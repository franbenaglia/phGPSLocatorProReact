import { useEffect } from 'react';
import './PhotoAlbum.css';
import { usePhotoGallery } from "../hooks/userPhotoGallery";
import { UserPhoto } from '../model/userPhoto';
import { deletePhoto } from '../helper/StorageHelper';
import { IonCol, IonGrid, IonImg, IonRow, useIonActionSheet } from '@ionic/react';
import PhotoAlbumContainer from './PhotoAlbumContainer';

interface ContainerProps {
    name: string;
}

const PhotoAlbum: React.FC<ContainerProps> = ({ name }) => {

    useEffect(() => {
        usePhotoGallery().loadSaved();
        usePhotoGallery().loadSavedCategorizedFromMarks();
    }, []);

    const [present] = useIonActionSheet();

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
        <div >

            <IonGrid>
                <IonRow>
                    Photos from camera
                </IonRow>
                {usePhotoGallery().photos && usePhotoGallery().photos.map((photo, position) => {
                    return (
                        <IonRow>
                            <IonCol size="4">
                                <IonImg src={photo.base64Data as string} onClick={() => showActionSheet(photo, position)} ></IonImg>
                            </IonCol>
                        </IonRow>
                    )
                }
                )
                }
            </IonGrid>
            Photos from marks

            {

                usePhotoGallery().coordinateCategorized && usePhotoGallery().coordinateCategorized.map(cc => {
                    return (
                        <IonGrid>
                            <IonRow>
                                {cc.category}
                            </IonRow>
                            <IonRow>
                                {cc.coordinates && cc.coordinates.map(c => {

                                    return (
                                        <IonCol size="4">
                                            <PhotoAlbumContainer {...c as any} />
                                        </IonCol>
                                    )

                                }
                                )
                                }
                            </IonRow>
                        </IonGrid >
                    )

                }


                )
            }
        </div >
    );
};

export default PhotoAlbum;
