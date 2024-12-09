
import { Preferences } from '@capacitor/preferences';
import { catchError, from, mergeMap, Observable, of } from 'rxjs';

const CATEGORY: string = 'categories';

export const init = () => {

    let categories = ['General', 'Building', 'Street', 'People'];

    getCategories().subscribe(c => {
        if (!c.value) {
            setCategories(categories);
        }
    });

}

export const addCategory = (category: string) => {

    let categories: string[] = []

    getCategories().subscribe(c => {
        let cs: string[] = JSON.parse(c.value);
        categories.push(...cs);
        categories.push(category);
        Preferences.set({
            key: CATEGORY,
            value: JSON.stringify(categories),
        });
    });
}

export const getCategories = () => {

    return from(Preferences.get({
        key: CATEGORY
    }));

}

export const categoryExist = (category: string): Observable<any> => {

    return getCategories().pipe(
        mergeMap(cs => {
            let cats: string[] = JSON.parse(cs.value);
            let i = cats.findIndex(c => c === category)
            return of(i !== -1);
        }),
        catchError(err => {
            console.log(err);
            return err;
        }
        ));

}

export const setCategories = (categories: string[]) => {

    Preferences.set({
        key: CATEGORY,
        value: JSON.stringify(categories),
    });

}


