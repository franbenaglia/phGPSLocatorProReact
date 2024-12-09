
import { from, Observable, of } from 'rxjs';
import { Coordinate } from '../model/coordinate';
import { openDB, IDBPDatabase } from '@tempfix/idb';
import { UserPhoto } from '../model/userPhoto';

const dbname = 'phGPSLocatorPro';
const version = 5;
const storeNames = ['coordinates', 'photos'];

let index: IDBIndex[];
let dabOpen: IDBPDatabase;


export const openDb = async () => {

    dabOpen = await openDB(dbname, version, {

        upgrade(db, oldVersion, newVersion, transaction, event) {

            if (newVersion) {
                for (let storeName of storeNames) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        let store = db.createObjectStore(storeName, { autoIncrement: true });
                        //TODO SEE THAT
                        //index[storeName] = store.createIndex(storeName + '_idx', storeName);
                    }
                }
            }

        },
        blocked(currentVersion, blockedVersion, event) {
            console.log('Another connection of diferent version is open');
        },
        blocking(currentVersion, blockedVersion, event) {

        },
        terminated() {
            console.log('Abnormally terminates the connection');
        },
    });

}

export const addElement = async (item: any, storeName: string) => {//item: {id: storename:}

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
    await dabOpen.put(storeName, item, item.id)
}


export const findAllElementsByCriterion = async (criterion: any | null, storeName: string): Promise<any[]> => {

    return await dabOpen.getAll(storeName);


}

export const findAllElements = async (storeName: string): Promise<any[]> => {
    return findAllElementsByCriterion(null, storeName);
}


export const findAllCursorElements = async (storeName: string) => {

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
    let key = e.id;
    await dabOpen.delete(storage, key);
}
