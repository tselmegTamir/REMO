import { create } from "zustand"
import {LocationStore} from "@/types/type";

export const useLocationStore = create<LocationStore>((set) =>({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationAddress: null,
    destinationLongitude: null,
    destinationLatitude: null,
    setUserLocation: ({latitude, longitude, address}) => {
        set(() => ({
            userAddress: address,
            userLongitude: longitude,
            userLatitude: latitude,
        }))
    },
    setDestinationLocation: ({latitude, longitude, address}) => {
        set(() => ({
            destinationAddress: address,
            destinationLongitude: longitude,
            destinationLatitude: latitude,
        }))
    },
}))