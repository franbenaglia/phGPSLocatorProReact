import { createContext, useState } from "react";
import { Coordinate } from "../model/coordinate";

export interface MapContextI {

    dismissPopOver: boolean,
    openPhotoContent: boolean,
    isPopoverOpen: boolean,
    coordinate: Coordinate,
    coordinates: Coordinate[],

    setDismissPopOver: (newData: any) => void,
    setOpenPhotoContent: (newData: any) => void,
    setIsPopoverOpen: (newData: any) => void,
    setCoordinate: (newData: Coordinate) => void,
    setCoordinates: (newData: Coordinate[]) => void,
    updateCoordinate: (coordinate: Coordinate) => void

}

export const MapContext = createContext<MapContextI>(null);

export const MapProvider = ({ children }) => {

    const [dismissPopOver, setDismissPopOver] = useState(false);
    const [openPhotoContent, setOpenPhotoContent] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [coordinate, setCoordinate] = useState({} as Coordinate);
    const [coordinates, setCoordinates] = useState([] as Coordinate[]);

    const updateCoordinate = (coordinate: Coordinate) => {

        const updatedCoord = coordinates.map(c => {
            if (c.lat === coordinate.lat && c.lng === coordinate.lng) {
                return coordinate;
            } else {
                return c;
            }
        });

        setCoordinates(updatedCoord);
    }

    return (
        <MapContext.Provider value={{
            dismissPopOver, openPhotoContent,
            setOpenPhotoContent, setDismissPopOver, isPopoverOpen, setIsPopoverOpen, coordinate, coordinates,
            setCoordinate, setCoordinates, updateCoordinate
        }}>
            {children}
        </MapContext.Provider>
    );

}