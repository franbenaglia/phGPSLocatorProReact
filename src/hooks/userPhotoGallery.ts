import { useState } from "react";
import { UserPhoto } from "../model/userPhoto";
import { Coordinate } from "../model/coordinate";

import { Filesystem, Directory } from '@capacitor/filesystem';

import { Camera, CameraResultType, CameraSource, GalleryPhotos, GalleryPhoto, Photo } from '@capacitor/camera';
import { Capacitor } from "@capacitor/core";
import { addPhoto, getPhotos, getPositions } from "../helper/StorageHelper";
import { getCategories } from "../helper/CategoryHelper";
import { Preferences } from "@capacitor/preferences";

import { from, Observable, of } from 'rxjs';

export function usePhotoGallery() {

    const PHOTO_STORAGE: string = 'photos';

    const [photos, setPhotos] = useState<UserPhoto[]>([]);
    //const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

    const [coordinateCategorized, setCoordinateCategorized] = useState<CoordinateCategory[]>([]);

    const userPhoto = async (): Promise<UserPhoto> => {

        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        });

        return savePicture(capturedPhoto);

    }

    const savePicture = async (photo: Photo | GalleryPhoto) => {

        const base64Data = await readAsBase64(photo);

        const fileName = Date.now() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            //https://stackoverflow.com/questions/67039901/how-to-copy-a-private-folder-with-content-to-public-directory-in-android-q-and-h
            directory: Directory.Data //https://github.com/ionic-team/capacitor/discussions/4487
        });

        if (Capacitor.isNativePlatform()) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
                //base64Data: base64Data, TODO SEE THAT
            };
        }
        else {
            return {
                filepath: fileName,
                webviewPath: photo.webPath,
                base64Data: base64Data,
            };
        }
    }

    const addNewToGallery = async () => {
        /*
            const capturedPhoto = await Camera.getPhoto({
              resultType: CameraResultType.Uri,
              source: CameraSource.Camera,
              quality: 100
            });
        
            const savedImageFile = await this.savePicture(capturedPhoto);
        */

        const savedImageFile = await userPhoto();

        addPhoto(savedImageFile);
        /*
            Preferences.set({
              key: this.PHOTO_STORAGE,
              value: JSON.stringify(this.photos),
            });
            */

    }

    const getImage = async (): Promise<UserPhoto> => {

        const capturedPhoto: GalleryPhotos = await Camera.pickImages({
            quality: 100
        });

        let photo: GalleryPhoto = capturedPhoto.photos[0];

        return savePicture(photo);

    }

    const addImageToGallery = async () => {

        const capturedPhoto: GalleryPhotos = await Camera.pickImages({
            quality: 100
        });

        let photo: GalleryPhoto = capturedPhoto.photos[0];

        const savedImageFile = await savePicture(photo);

        addPhoto(savedImageFile);
    }

    const loadSaved = () => {

        getPhotos().subscribe(ps => {

            setPhotos(ps);

            /*
            if (!this.platform.is('hybrid')) {
      
              for (let photo of this.photos) {
      
                const readFile = await Filesystem.readFile({
                  path: photo.filepath,
                  directory: Directory.Data
                });
      
                photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
              }
            }
              */

        });
    }

    const loadSavedCategorizedFromMarks = () => {

        getPositions().subscribe(p => {

            setCoordinateCategorized(previoous => []);

            const coordinates = p.filter(c => c.photo)

            let categories: string[] = [];
            getCategories().subscribe(cs => {
                categories.push(...JSON.parse(cs.value));
                categories.forEach(c => {
                    let t = coordinates.filter(co => co.category === c && co.photo);
                    if (t.length > 0) {
                        let cCat: CoordinateCategory = {
                            category: c,
                            coordinates: coordinates.filter(co => co.category === c)
                        }
                        const exist = coordinateCategorized.find(cc => cc.category === cCat.category)
                        if (!exist) {
                            coordinateCategorized.push(cCat);
                            setCoordinateCategorized(coordinateCategorized);
                        }
                    }
                });
            });

        });

    }

    const readAsBase64 = async (photo: Photo | GalleryPhoto) => {

        if (Capacitor.isNativePlatform()) {

            const file = await Filesystem.readFile({
                path: photo.path!
            });

            return file.data;
        }
        else {

            const response = await fetch(photo.webPath!);
            const blob = await response.blob();

            return await convertBlobToBase64(blob) as string;
        }
    }

    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    const deletePicture = async (photo: UserPhoto, position: number) => {

        setPhotos(photos.splice(position, 1));

        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos)
        });

        const filename = photo.filepath
            .substr(photo.filepath.lastIndexOf('/') + 1);

        await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Data
        });
    }

    const checkPermissions = (): Observable<any> => {

        if (Capacitor.isNativePlatform()) {
            return from(Camera.checkPermissions());
        } else {
            return of('web');
        }

    }

    return {
        setPhotos,
        photos,
        loadSaved,
        loadSavedCategorizedFromMarks,
        coordinateCategorized,
        checkPermissions,
        addNewToGallery,
        addImageToGallery,
        userPhoto,
        getImage
    };

}

class CoordinateCategory {
    coordinates: Coordinate[];
    category: string;
}



