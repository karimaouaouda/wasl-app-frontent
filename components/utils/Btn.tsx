import { TouchableOpacity, Text } from "react-native";

export default function Btn({ text, onPress, classes }: { text: string; onPress?: () => void; classes?: string }) {
    return (
        <TouchableOpacity onPress={onPress} className={"bg-red-500 rounded-lg py-3 px-2 w-80 " + classes}>
            <Text className="text-white font-bold text-center text-lg">{text}</Text>
        </TouchableOpacity>
    );
}   