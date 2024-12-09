import { IonCard, IonCardHeader, IonCardContent, IonIcon, IonGrid, IonRow, IonCol, IonInput, IonButton, IonToast } from '@ionic/react';
import './PhotoAlbumContainer.css';
import { closeCircle } from 'ionicons/icons';
import { Coordinate } from '../model/coordinate';
import { addCategory, categoryExist } from '../helper/CategoryHelper';
import { useEffect, useState } from 'react';

interface ContainerProps {
    coordinate: Coordinate;
}

const Configuration: React.FC<ContainerProps> = ({ }) => {

    const [category, setCategory] = useState('');

    const [isToastOpen, setIsToastOpen] = useState(false);

    const setOpen = (isOpen: boolean) => {
        setIsToastOpen(isOpen);
    }

    const categoryHandler = () => {
        if (category) {
            categoryExist(category).subscribe(e => {
                if (!e) {
                    addCategory(category);
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























