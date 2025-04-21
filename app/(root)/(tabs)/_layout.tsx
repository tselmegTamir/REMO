import { Tabs } from "expo-router";
import {ImageSourcePropType, View, Image} from "react-native"
import {icons} from "@/constants"

const TabIcon = ({ focused, source }: { source: ImageSourcePropType, focused: boolean }) => (
    <View className="items-center justify-center w-full h-full">
        <View className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}>
            <Image
                source={source}
                tintColor="white"
                resizeMode="contain"
                className="w-7 h-7"
            />
        </View>
    </View>
);

const Layout = () => {
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#333333",
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 20,
                    height: 78,
                    position: "absolute",
                    overflow: "hidden",
                },
                tabBarItemStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                    height: 78, // very important
                    marginTop: 20,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.home} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.search} />
                    ),
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: "Scan",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.scan} />
                    ),
                }}
            />
            <Tabs.Screen
                name="loc"
                options={{
                    title: "Location",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.location} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.profile} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default Layout;
