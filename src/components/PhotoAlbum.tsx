import { useEffect } from 'react';
import './PhotoAlbum.css';
import { usePhotoGallery } from "../hooks/userPhotoGallery";
import { UserPhoto } from '../model/userPhoto';
import { deletePhoto } from '../helper/StorageHelper';
import { IonCol, IonGrid, IonImg, IonRow, useIonActionSheet } from '@ionic/react';
import PhotoAlbumContainer from './PhotoAlbumContainer';


const PhotoAlbum: React.FC = () => {

    const { loadSaved, loadSavedCategorizedFromMarks, photos, coordinateCategorized } = usePhotoGallery();

    useEffect(() => {
        //loadSaved();
        loadSavedCategorizedFromMarks();
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
                {photos && photos.map((photo, position) => {
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

                coordinateCategorized && coordinateCategorized.map(cc => {
                    return (
                        <IonGrid>
                            <IonRow>
                                {cc.category}
                            </IonRow>
                            <IonRow>
                                {cc && cc.coordinates && cc.coordinates.map(c => {

                                    return (
                                        <IonCol size="4">
                                            <PhotoAlbumContainer coordinate={c} />
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
