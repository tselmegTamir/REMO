import { Text, Image, View, ScrollView, Alert } from "react-native";
import InputField from "@/components/InputField";
import { images, icons } from "@/constants";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import OAuth from "@/components/OAuth";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

const SignIn = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const onSignInPress = async () => {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
            router.push('/(root)/(tabs)/home');
        } catch (err: any) {
            console.error(err);
            Alert.alert("Login Failed", err.message);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className="text-black text-2xl font-JakartaSemiBold absolute bottom-5 left-5">
                        Тавтай морил
                    </Text>
                </View>
                <View className="p-5">
                    <InputField
                        label="Э-мэйл"
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({ ...form, email: value })}
                    />
                    <InputField
                        label="Нууц үг"
                        placeholder="Enter your password"
                        icon={icons.lock}
                        secureTextEntry={true}
                        value={form.password}
                        onChangeText={(value) => setForm({ ...form, password: value })}
                    />
                    <CustomButton title="Нэвтрэх" onPress={onSignInPress} className="mt-6" />

                    <OAuth />

                    <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
                        <Text>Бүртгүүлээгүй юу?</Text>
                        <Text className="text-primary-500"> Бүртгүүлэх</Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
};

export default SignIn;
