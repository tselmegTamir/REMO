import { View, Text } from "react-native";
import MapView, {PROVIDER_DEFAULT} from "react-native-maps";
import { useLocationStore } from "@/store";
import { calculateRegion } from "@/lib/map";

const Map = () => {

    const {
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    } = useLocationStore();

    const region = calculateRegion({
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    })

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            className="w-full h-full rounded-2xl"
            tintColor="black"
            mapType="mutedStandard"
            initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle="light"
        >

        </MapView>
    );
};

export default Map;