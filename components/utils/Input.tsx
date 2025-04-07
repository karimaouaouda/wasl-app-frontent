import { TextInput, View, Text } from "react-native";
 
interface InputProps {
    placeholder: string;
    keyboardType: "default" | "email-address" | "numeric" | "phone-pad";
    inputErrorClasses?: string;
    secureTextEntry?: boolean;
    error?: string;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function Input(InputProps: InputProps) {
    return (
        <View className="flex flex-col space-y-1 w-full items-center justify-center">
            <TextInput
                className={"border rounded-lg p-4 w-4/5 " + (InputProps.error ? InputProps.inputErrorClasses : "border-gray-300")}
                placeholder={InputProps.placeholder}
                keyboardType={InputProps.keyboardType}
                secureTextEntry={InputProps.secureTextEntry}
                autoCapitalize={InputProps.autoCapitalize}
            />
            <Text className="text-red-500 ml-4 text-sm">{InputProps.error??''}</Text>
        </View>
    );
}