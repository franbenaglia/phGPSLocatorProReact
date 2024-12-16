import { openDB, IDBPDatabase } from '@tempfix/idb';

const dbname = 'phGPSLocatorPro';
const version = 5;
const storeNames = ['coordinates', 'photos'];

export const openDb = async () => {

    let index: IDBIndex[];

    const dabOpen: IDBPDatabase = await openDB(dbname, version, {

        upgrade(db, oldVersion, newVersion, transaction, event) {

            if (newVersion) {
                for (let storeName of storeNames) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        let store = db.createObjectStore(storeName, { autoIncrement: true });
                        index[storeName] = store.createIndex(storeName + '_idx', storeName);
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

    return dabOpen;

}

