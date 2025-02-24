import React, { useState } from "react";
import { PlatformColor, Text, View } from "react-native";
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
			focusedIcon: { sfSymbol: "house" },
		},
		{
			key: "favourites",
			title: "Favourites",
			focusedIcon: { sfSymbol: "heart" },
		},
	]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SystemBars style="auto" />
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
		backgroundColor: PlatformColor("systemBackground"),
		alignItems: "center",
		justifyContent: "center",
	},
});
