import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function Index() {

  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Index screen mounted");
    return () => {
      console.log("Index screen unmounted");
    };
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen</Text>
      <Link href="/auth/login" asChild>
        <Text className="bg-red-500 font-bold">Go to login form</Text>
      </Link>
    </View>
  );
}
