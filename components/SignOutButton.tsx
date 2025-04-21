import { Text, TouchableOpacity, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/FirebaseConfig";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Optional icon lib

const SignOutButton = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)/welcome"); // or wherever your login screen is
        } catch (error: any) {
            Alert.alert("Sign Out Error", error.message);
        }
    };

    return (
        <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 p-3 rounded-xl flex-row items-center justify-center"
        >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text className="text-white ml-2 font-JakartaSemiBold text-base">
                Sign Out
            </Text>
        </TouchableOpacity>
    );
};

export default SignOutButton;
