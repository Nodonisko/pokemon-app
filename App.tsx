import React, { useState } from "react";
import { Platform, PlatformColor, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabView, { SceneMap } from "react-native-bottom-tabs";
import { SystemBars } from "react-native-edge-to-edge";

import { HomeScreen } from "./src/screens/Home";
import { FavouritesScreen } from "./src/screens/Favourites";

const renderScene = SceneMap({
	home: HomeScreen,
	favourites: FavouritesScreen,
});

export default function App() {
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{
			key: "home",
			title: "Home",
			focusedIcon: Platform.select({ ios: { sfSymbol: "square.stack.fill" }, android: require("./src/assets/square.stack.fill.svg") }),
			unfocusedIcon: Platform.select({ ios: { sfSymbol: "square.stack" }, android: require("./src/assets/square.stack.svg") }),
		},
		{
			key: "favourites",
			title: "Favourites",
			focusedIcon: Platform.select({ ios: { sfSymbol: "heart.fill" }, android: require("./src/assets/heart.fill.svg") }),
			unfocusedIcon: Platform.select({ ios: { sfSymbol: "heart" }, android: require("./src/assets/heart.svg") }),
			freezeOnBlur: true,
		},
	]);

	return (
		<GestureHandlerRootView style={styles.container}>
			<SystemBars style="dark" />
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				labeled
			/>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
