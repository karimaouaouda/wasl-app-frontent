import { SafeAreaView, ScrollView, View } from "react-native";

export default function AuthManager({children}: {children: React.ReactNode}) {
  return (
    <SafeAreaView>
        <ScrollView className="w-screen h-screen bg-slate-100 p-4">
            {children}
        </ScrollView>
    </SafeAreaView>
  );
}