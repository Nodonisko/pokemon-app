import React, { useState } from "react";
import { Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabView, { SceneMap } from "react-native-bottom-tabs";
import { SystemBars } from "react-native-edge-to-edge";

import { AllPokemonScreen } from "./src/screens/AllPokemon";
import { MyDeckScreen } from "./src/screens/MyDeck";

const renderScene = SceneMap({
	allPokemons: AllPokemonScreen,
	myDeck: MyDeckScreen,
});

const routes = [
	{
		key: "allPokemons",
		title: "All Pokémons",
		focusedIcon: Platform.select({
			ios: { sfSymbol: "square.stack.fill" },
			android: require("./src/assets/square.stack.fill.svg"),
		}),
		unfocusedIcon: Platform.select({
			ios: { sfSymbol: "square.stack" },
			android: require("./src/assets/square.stack.svg"),
		}),
	},
	{
		key: "myDeck",
		title: "My Deck",
		focusedIcon: Platform.select({
			ios: { sfSymbol: "heart.fill" },
			android: require("./src/assets/heart.fill.svg"),
		}),
		unfocusedIcon: Platform.select({
			ios: { sfSymbol: "heart" },
			android: require("./src/assets/heart.svg"),
		}),
		freezeOnBlur: true,
	},
]

export default function App() {
	const [index, setIndex] = useState(0);

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
