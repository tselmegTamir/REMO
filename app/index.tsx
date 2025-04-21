import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/FirebaseConfig"; // your exported auth instance

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  if (!authChecked) return null; // Show loading if you want

  return user ? (
      <Redirect href="/(root)/(tabs)/home" />
  ) : (
      <Redirect href="/(auth)/welcome" />
  );
};

export default Page;
