
import { Capacitor } from '@capacitor/core';
import { Observable, from, bindCallback, of } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

export const getCurrentPosition = (): Observable<any> => {

    if (!Capacitor.isNativePlatform()) {
        return from(getPositionFromNavigator());
    } else {
        return from(currentPositionNative());
    }
}

export const currentPositionNative = async () => {
    return await Geolocation.getCurrentPosition();
};

export const getPositionFromNavigator = () => {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

export const checkPermissions = (): Observable<any> => {

    if (Capacitor.isNativePlatform()) {
        return from(Geolocation.checkPermissions());
    } else {
        return of('web');
    }

}


