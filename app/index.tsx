import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

//define interface TestData
interface TestData {
  message: string;
}


export default function Index() {

  const [data, setData] = useState(null);

  //set credentials to true axios
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;


  useEffect(()=> {
     axios.get('http://localhost:8000/sanctum/csrf-cookie')
  }, [])
      // If authenticated, redirect to the home screen
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
        <Text className="bg-red-500 font-bold">Go to logi form</Text>
        </Link>
    </View>
  );
}
