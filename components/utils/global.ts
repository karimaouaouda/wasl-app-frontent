import { StyleSheet } from "react-native";


// make default styles that matches tailwindcss common classes
const globalStyles = StyleSheet.create({
    flexCol:{
        display: "flex",
        flexDirection: "column",
    },
    flexRow:{
        display: "flex",
        flexDirection: "row",
    },
    justifyCenter:{
        justifyContent: "center",
    },
    justifyBetween:{
        justifyContent: "space-between",
    },
    justifyAround:{
        justifyContent: "space-around",
    },
    justifyEvenly:{
        justifyContent: "space-evenly",
    },
    itemsCenter:{
        alignItems: "center",
    },
    itemsStart:{
        alignItems: "flex-start",
    },
    itemsEnd:{
        alignItems: "flex-end",
    },
    itemsStretch:{
        alignItems: "stretch",
    },
    truncate:{
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    textCenter:{
        textAlign: "center",
    },
    textLeft:{
        textAlign: "left",
    },
    textRight:{
        textAlign: "right",
    },
    shadow:{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    shadowSm:{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 1,
    },
    p4: {
        padding: 16,
    },
    p2: {
        padding: 8,
    },
    p1: {
        padding: 4,
    },
});