
import { Capacitor } from '@capacitor/core';
import { Observable } from 'rxjs';
import { Coordinate } from '../model/coordinate';
import { UserPhoto } from '../model/userPhoto';
import {
    getPositions as getPositionsSqlLite, initDatabase,
    getPhotos as getPhothosSqlLite, addNewPosition as addNewPositionSqlLite,
    updatePosition as updatePositionSqlLite,
    deletePosition as deletePositionSqlLite,
    deletePhoto as deletePhotoSqlLite,
    addPhoto as addPhotoSqlLite
} from './SqlLiteHelper';
import {
    openDb, getPositions as getPositionsIndexedDb,
    getPhotos as getPhothosIndexedDb, addNewPosition as addNewPositionIndexedDb,
    updatePosition as updatePositionIndexedDb,
    deletePosition as deletePositionIndexedDb,
    deletePhoto as deletePothoIndexedDb,
    addPhoto as addPhotoIndexedDb,
} from './Indexeddbhelper';


export const init = async () => {

    if (Capacitor.isNativePlatform()) {
        await initDatabase();
    } else {
        await openDb();
    }
}

export const isNative = (): boolean => {
    return Capacitor.isNativePlatform();
}


export const getPositions = (): Observable<Coordinate[]> => {
    if (!isNative()) {
        return getPositionsIndexedDb();
    } else {
        return getPositionsSqlLite();
    }
}

export const getPhotos = (): Observable<UserPhoto[]> => {
    if (!isNative()) {
        return getPhothosIndexedDb();
    } else {
        return getPhothosSqlLite();
    }
}

export const ddNewPosition = async (c: Coordinate) => {
    if (!isNative()) {
        return await addNewPositionIndexedDb(c);
    } else {
        return await addNewPositionSqlLite(c);
    }
}


export const updatePosition = async (c: Coordinate) => {
    if (!isNative()) {
        return await updatePositionIndexedDb(c);
    } else {
        return await updatePositionSqlLite(c);
    }
}

export const deletePosition = async (c: Coordinate) => {
    if (!isNative()) {
        return await deletePositionIndexedDb(c);
    } else {
        return await deletePositionSqlLite(c);
    }
}

export const deletePhoto = async (up: UserPhoto) => {
    if (!isNative()) {
        return await deletePothoIndexedDb(up);
    } else {
        return await deletePhotoSqlLite(up);
    }
}

export const addPhoto = async (up: UserPhoto) => {
    if (!isNative()) {
        return await addPhotoIndexedDb(up);
    } else {
        return await addPhotoSqlLite(up);
    }
}


