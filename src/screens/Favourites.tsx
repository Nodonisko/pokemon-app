import { View, Text, PlatformColor } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const FavouritesScreen = () => (
	<View style={styles.container}>
		<Text>Favourites Screen</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: PlatformColor("systemBackground"),
		alignItems: "center",
		justifyContent: "center",
	},
});
