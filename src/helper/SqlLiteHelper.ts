import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { Coordinate } from '../model/coordinate';
import { UserPhoto } from '../model/userPhoto';
//https://github.com/capacitor-community/sqlite/blob/master/docs/API.md
//https://www.sqlite.org/autoinc.html
//https://www.sqlite.org/limits.html


let isIOS: boolean;
let dbName: string;

export const initDatabase = async () => {

    const dbSetup = await Preferences.get({ key: 'first_setup' })

    if (!dbSetup.value) {
        setUpDatabase();
    } else {
        dbName = await getDbName();
        await CapacitorSQLite.createConnection({ database: dbName });
        await CapacitorSQLite.open({ database: dbName })
    }

}

export const setUpDatabase = async () => {

    const response = await fetch('assets/db.json');
    const json = await response.json();
    const jsonstring = JSON.stringify(json);
    const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

    if (isValid.result) {

        dbName = json.database;

        await CapacitorSQLite.importFromJson({ jsonstring });

        await CapacitorSQLite.createConnection({ database: dbName });
        await CapacitorSQLite.open({ database: dbName })

        await Preferences.set({ key: 'first_setup', value: '1' });
        await Preferences.set({ key: 'dbname', value: dbName });

    }

}

export const getDbName = async () => {

    if (!dbName) {
        const dbname = await Preferences.get({ key: 'dbname' })
        if (dbname.value) {
            dbName = dbname.value
        }
    }
    return dbName;
}

export const create = async (element: any, table: string): Promise<capSQLiteChanges> => {

    let sql = 'INSERT INTO ' + table + ' VALUES(?)';

    const dbName = await getDbName();

    const jsonstring = JSON.stringify(element);

    return await CapacitorSQLite.executeSet({
        database: dbName,
        set: [
            {
                statement: sql,
                values: [
                    jsonstring
                ]
            }
        ]
    });
}

export const read = async (table: string) => {

    let sql = 'SELECT * FROM ' + table;

    const dbName = await getDbName();

    return await CapacitorSQLite.query({
        database: dbName,
        statement: sql,
        values: []
    }).then((response: capSQLiteValues) => {

        let elements: any[] = [];

        for (let index = 0; index < response.values.length; index++) {
            const element = response.values[index];
            elements.push(element);
        }
        return elements;

    }).catch(err => Promise.reject(err))
}

export const getPositions = (): Observable<Coordinate[]> => {
    return from(read('coordinates'));
}

export const getPhotos = (): Observable<UserPhoto[]> => {
    return from(read('photos'));
}

export const addNewPosition = async (c: Coordinate) => {
    create(c, 'coordinates');
}

export const addPhoto = async (up: UserPhoto) => {
    await create(up, 'photos');
}

export const _delete = async (element: any, storage: string): Promise<capSQLiteChanges> => {

    let sql = 'DELETE FROM ' + storage + ' WHERE id=?';

    const dbName = await getDbName();

    return await CapacitorSQLite.executeSet({
        database: dbName,
        set: [
            {
                statement: sql,
                values: [
                    element.id
                ]
            }
        ]
    }).catch(err => Promise.reject(err))
}

export const deletePhoto = async (up: UserPhoto) => {
    await _delete(up, 'photos');
}

export const deletePosition = async (c: Coordinate) => {
    await _delete(c, 'coordinates');
}

export const update = async (element: any, storage: string): Promise<capSQLiteChanges> => {

    let sql = 'UPDATE ' + storage + ' SET ' + storage + '=? WHERE id=?';

    const dbName = await getDbName();

    return await CapacitorSQLite.executeSet({
        database: dbName,
        set: [
            {
                statement: sql,
                values: [
                    element,
                    element.id
                ]
            }
        ]
    }).catch(err => Promise.reject(err))
}

export const updatePosition = async (c: Coordinate) => {
    await update(c, 'coordinates');
}



