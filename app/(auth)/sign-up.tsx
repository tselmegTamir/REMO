import { useState } from "react";
import { Alert, Text, Image, View, ScrollView, Button, Modal } from "react-native";
import ReactNativeModal from "react-native-modal";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { images, icons } from "@/constants";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/FirebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";


// Email Verification Modal

const EmailVerificationModal = ({ visible, email, onVerified, onHide } : {visible: boolean, email: String, onVerified: () => void, onHide: () => void}) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Add loading state

    const handleVerificationCheck = async () => {
        const user = auth.currentUser;

        if (!user) {
            setError("Please enter a valid email");
            return;
        }

        try {
            setLoading(true); // Start loading
            let attempts = 0;
            while (attempts < 3) {
                await user.reload();
                if (user.emailVerified) {
                    setLoading(false);
                    console.log("✅ Email verified. Showing success modal...");
                    onVerified();
                    return;
                }
                attempts++;
                await new Promise((res) => setTimeout(res, 1500));
            }
            setError("Your email is not verified yet. Please check your inbox.");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Stop loading regardless
        }
    };

    return (
        <ReactNativeModal isVisible={visible} onModalHide={onHide}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] justify-center">
                <Image source={icons.email} className="w-[80px] h-[80px] mx-auto mb-4" />
                <Text className="text-2xl font-JakartaSemiBold text-center mb-2">Имэйлээ баталгаажуулаарай.</Text>
                <Text className="text-base text-center text-gray-500 mb-4">
                    Бид баталгаажуулах холбоосыг {email} хаяг руу илгээлээ. Холбоос дээр дарж, доорх товчийг дараарай.
                </Text>
                {error && <Text className="text-red-500 text-sm text-center mb-3">{error}</Text>}

                {/* ✅ CustomButton with dynamic state */}
                <CustomButton
                    title={loading ? "Шалгаж байна..." : "Би баталгаажуулсан"}
                    onPress={handleVerificationCheck}
                    disabled={loading}
                    className={`bg-primary ${loading ? "opacity-50" : ""}`}
                />
            </View>
        </ReactNativeModal>
    );
};


const SignUp = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const onSignUpPress = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            await sendEmailVerification(userCredential.user);

            setShowEmailModal(true);
        } catch (err: any) {
            Alert.alert("Sign up failed", err.message);
        }
    };

    console.log("🎉 showSuccessModal state:", showSuccessModal);

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className="text-black text-2xl font-JakartaSemiBold absolute bottom-5 left-5">
                        Бүртгүүлэх
                    </Text>
                </View>
                <View className="p-5">
                    <InputField
                        label="Нэр"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm({ ...form, name: value })}
                    />
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
                        secureTextEntry
                        value={form.password}
                        onChangeText={(value) => setForm({ ...form, password: value })}
                    />
                    <CustomButton title="Бүртгүүлэх" onPress={onSignUpPress} className="mt-6" />

                    {/* OAuth */}
                    <OAuth />

                    <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
                        <Text>Аль хэдийн бүртгүүлсэн үү?</Text>
                        <Text className="text-primary-500"> Нэвтрэх</Text>
                    </Link>
                </View>

                {/* 🔐 Email Verification Modal */}
                <EmailVerificationModal
                    visible={showEmailModal}
                    email={form.email}
                    onVerified={() => {
                        setShowEmailModal(false);
                    }}
                    onHide={async () => {
                        const user = auth.currentUser;
                        if (user) {
                            const userDoc = {
                                name: form.name,
                                email: form.email,
                                img: "@/assets/icons/person.png",
                                role: 'regular',
                                score: 0,
                                plastic: 0,
                                glass:   0,
                                metal:   0,
                                other:   0,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            };
                            try {
                                await setDoc(doc(db, "users", user.uid), userDoc);
                            } catch (e) {
                                console.error(e);
                            }
                        }
                        setShowSuccessModal(true);
                    }}
                />

                {/* ✅ Success Modal */}
                <ReactNativeModal isVisible={showSuccessModal} key={`success-modal-${showSuccessModal}`} onModalShow={() => console.log("🎬 Modal is now visible!")}>
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5" />
                        <Text className="text-2xl font-JakartaBold text-center">Баталгаажлаа.</Text>
                        <Text className="text-base text-gray-400 font-Jakarta text-center">
                            Таны бүртгэл амжилттай баталгаажлаа.
                        </Text>
                        <CustomButton
                            title="Нүүр хуудас руу очих"
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.push("/(root)/(tabs)/home");
                            }}
                        />
                    </View>
                </ReactNativeModal>

            </View>
        </ScrollView>
    );
};

export default SignUp;
