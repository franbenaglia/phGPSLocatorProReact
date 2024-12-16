import { useContext, useEffect, useState } from 'react';
import { Coordinate } from '../model/coordinate';
import './MarkerContent.css';
import { UserPhoto } from '../model/userPhoto';
import { from, Observable, of } from 'rxjs';
import { addNewPosition, deletePosition, getPositions, updatePosition } from '../helper/StorageHelper';
import { usePhotoGallery } from '../hooks/userPhotoGallery';
import { getCategories } from '../helper/CategoryHelper';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonGrid, IonIcon, IonInput, IonRow, IonSelect, IonSelectOption } from '@ionic/react';
import { closeCircle, trashOutline } from 'ionicons/icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MapContext } from '../contexts/MapContext';

interface ContainerProps {
  coordinate: Coordinate;
}

const urllocalserver = import.meta.env.VITE_URL_LOCAL_SERVER;

const MarkerContent: React.FC<ContainerProps> = ({ coordinate }) => {

  const { setOpenPhotoContent, setDismissPopOver, setIsPopoverOpen, setCoordinates, coordinates, updateCoordinate } = useContext(MapContext);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<Coordinate>();

  const { userPhoto, getImage } = usePhotoGallery();

  const [image, setImage] = useState({} as UserPhoto);

  const [category, setCategory] = useState('General');

  const [categories, setCategories] = useState([] as string[]);

  useEffect(() => {

    load();
    _getCategories();

  }, []);


  const load = () => {
    setValue('title', coordinate.title);
    setValue('description', coordinate.description);
    setValue('category', coordinate.category);
    setCategory(coordinate.category);
  }

  const onChange = ($event) => {
    setCategory($event);
  }

  const upLoadPhoto = async () => {
    const img = await userPhoto();
    setImage(img);
  }

  const upLoadImage = async () => {
    const img = await getImage();
    setImage(img);
  }

  const notImage = (): boolean => {
    return !coordinate.photo;
  }


  const showPhoto = () => {
    setOpenPhotoContent(true);
  }

  const close = () => {
    setDismissPopOver(true);
    setIsPopoverOpen((IsPopoverOpen) => false);
  }

  const _getCategories = (): void => {

    getCategories().subscribe(cs => {
      if (categories.length === 0) {
        categories.push(...JSON.parse(cs.value));
        setCategories(categories);
      }
    }
    );
  }

  const _delete = async () => {
    await deletePosition(coordinate);
    //window.location.assign(urllocalserver);
    window.location.reload();
  }

  const onSubmit: SubmitHandler<Coordinate> = async (data) => {

    let exist: any;
    let coordinates: Coordinate[];

    from(getPositions()).subscribe(ms => {

      coordinates = ms;

      if (coordinates) {
        exist = coordinates.find(c => c.lat === coordinate.lat && c.lng === coordinate.lng);
      }

      let title = data.title;
      let description = data.description;

      coordinate.description = description;
      coordinate.title = title;
      coordinate.photo = image;
      coordinate.date = new Date();
      coordinate.category = category;

      if (!exist) {
        addNewPosition(coordinate);
      } else {
        updatePosition(coordinate);
      }

      updateCoordinate(coordinate);

      setDismissPopOver(true);
      setIsPopoverOpen((IsPopoverOpen) => false);

    });

  }

  return (
    <div>
      <IonCard>
        <IonCardHeader>
          <IonIcon size="large" className="ion-icon-delete" icon={trashOutline} onClick={() => _delete()} ></IonIcon>
          <IonIcon size="large" className="ion-icon-close" onClick={() => close()} icon={closeCircle} ></IonIcon>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <IonRow>
                <IonInput labelPlacement="floating" label="Title" defaultValue="" {...register("title", { required: true })} >
                </IonInput>
                {errors.title && <span>Title is required</span>}
              </IonRow>
              <IonRow>
                <IonInput labelPlacement="floating" label="Descrption" defaultValue="" {...register("description", { required: true })} >
                </IonInput>
                {errors.description && <span>Description is required</span>}
              </IonRow>

              <IonRow>
                <IonSelect aria-label="Category" value={category} onIonChange={(e) => onChange(e.detail.value)}>
                  {categories && categories.map((c, index) => {
                    return (<IonSelectOption>{c}</IonSelectOption>)
                  })}
                </IonSelect>
              </IonRow>

              <IonRow>
                <IonButton type="submit" shape="round" size="small">Accept</IonButton>
                <IonButton shape="round" onClick={() => upLoadPhoto()} color='light' size="small" > Upload pic</IonButton>
                <IonButton shape="round" onClick={() => showPhoto()} disabled={notImage()} color='light' size="small" > Show pic</IonButton >
              </IonRow>
            </form >
          </IonGrid>
        </IonCardContent >
      </IonCard >
    </div >
  );
};

export default MarkerContent;