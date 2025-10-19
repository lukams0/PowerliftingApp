import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function athleteIndex() {
    return (
    <SafeAreaView>
        <Text style={styles.text}>Testttt</Text>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {color: "white"},
});