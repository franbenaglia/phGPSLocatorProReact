import { IonCard, IonCardHeader, IonCardContent, IonIcon, IonGrid, IonRow, IonCol, IonInput, IonButton, IonToast } from '@ionic/react';
import './PhotoAlbumContainer.css';
import { closeCircle } from 'ionicons/icons';
import { Coordinate } from '../model/coordinate';
import { addCategory, categoryExist } from '../helper/CategoryHelper';
import { useEffect, useState } from 'react';

const Configuration: React.FC = ({ }) => {

    const [category, setCategory] = useState('' as any);

    const [isToastOpen, setIsToastOpen] = useState(false);

    const setOpen = (isOpen: boolean) => {
        setIsToastOpen(isOpen);
    }

    const categoryHandler = () => {
        if (category) {
            categoryExist(category.value).subscribe(e => {
                if (!e) {
                    addCategory(category.value);
                    setOpen(true);
                } else {
                    setOpen(false)
                }
                setCategory('');
            }
            );
        }

    }

    return (
        <div>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonInput label="Add Category" onKeyUp={(event) => setCategory(event.target as any)}
                            placeholder="Enter category" value={category}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonButton onClick={() => categoryHandler()} shape="round" fill="outline">Accept</IonButton >
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonToast position="top" isOpen={isToastOpen} message="Category added" duration={2500}
                onDidDismiss={() => setOpen(false)}        ></IonToast>
        </div >
    );
};

export default Configuration;























