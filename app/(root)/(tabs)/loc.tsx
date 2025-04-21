import Map from "@/components/Map"
import {useEffect, useState} from "react";
import { useLocationStore } from "@/store";
import * as Location from "expo-location"

export default function Location() {

    const {setUserLocation, setDestinationLocation} = useLocationStore();
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    useEffect(() => {

        const requestLocation = async () => {
            let {status} = await    
        }

        requestLocation();
    }, []);

    return (
        <Map/>
    )
}