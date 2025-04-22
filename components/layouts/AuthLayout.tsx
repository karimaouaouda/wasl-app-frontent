import { useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, View } from "react-native";

export default function AuthManager({children, refreshAction}: {children: React.ReactNode, refreshAction: any}) {
  
  const [refresh, setRefresh] = useState(false);
  
  return (
    <SafeAreaView>
        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={refreshAction} />
          }
          className="w-screen h-screen bg-slate-100 p-4">
            {children}
        </ScrollView>
    </SafeAreaView>
  );
}