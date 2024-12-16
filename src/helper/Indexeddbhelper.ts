
import { from, Observable, of } from 'rxjs';
import { Coordinate } from '../model/coordinate';
import { UserPhoto } from '../model/userPhoto';
import { openDb } from './IndexeddbInitializer';


export const addElement = async (item: any, storeName: string) => {//item: {id: storename:}
    const dabOpen = await openDb();
    let transaction = dabOpen.transaction(storeName, "readwrite");

    let objectStore = transaction.objectStore(storeName);

    let id = await objectStore.add(item);

    item.id = id;

    let req = updateElement(item, storeName);

    transaction.oncomplete = function () {
        console.log("Transaction completed");
    };

}

export const updateElement = async (item: any, storeName: string) => {
    const dabOpen = await openDb();
    await dabOpen.put(storeName, item, item.id)
}


export const findAllElementsByCriterion = async (criterion: any | null, storeName: string): Promise<any[]> => {
    const dabOpen = await openDb();
    return await dabOpen.getAll(storeName);
}

export const findAllElements = async (storeName: string): Promise<any[]> => {
    return findAllElementsByCriterion(null, storeName);
}


export const findAllCursorElements = async (storeName: string) => {
    const dabOpen = await openDb();
    const tx = dabOpen.transaction(storeName);

    for await (const cursor of tx.store) {
        let key = cursor.key;
        let value = cursor.value;
        console.log(key, value);
    }

}


export const getPositions = (): Observable<Coordinate[]> => {
    return from(findAllElements('coordinates'));
}

export const getPhotos = (): Observable<UserPhoto[]> => {
    return from(findAllElements('photos'));
}

export const addNewPosition = async (c: Coordinate) => {
    await addElement(c, 'coordinates');
}

export const addPhoto = async (up: UserPhoto) => {
    await addElement(up, 'photos');
}

export const updatePosition = async (c: Coordinate) => {
    await updateElement(c, 'coordinates');
}

export const updatePhoto = async (up: UserPhoto) => {
    await updateElement(up, 'photos');
}

export const deletePosition = async (c: Coordinate) => {
    await deleteElement(c, 'coordinates');
}

export const deletePhoto = async (up: UserPhoto) => {
    await deleteElement(up, 'photos');
}

export const deleteElement = async (e: any, storage: string) => {
    const dabOpen = await openDb();
    let key = e.id;
    await dabOpen.delete(storage, key);
}
