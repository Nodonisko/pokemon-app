import { View, Text, PlatformColor, ActivityIndicator, Button } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Card } from "../components/Card";
import { useCallback, useEffect, useMemo, useState } from "react";
import  { usePokemonStore,CARDS_IN_DECK, Pokemon } from "../stores/pokemonStore";
import { useShallow } from 'zustand/react/shallow'
import { runOnUI } from "react-native-reanimated";

export const HomeScreen = () => {
	const likePokemon = usePokemonStore(state => state.likePokemon);
	const dislikePokemon = usePokemonStore(state => state.dislikePokemon);
	const fetchPokemons = usePokemonStore(state => state.fetchPokemons);
	const isLoading = usePokemonStore(state => state.isLoading);
	const hasMore = usePokemonStore(state => state.hasMore);
	const pokemons = usePokemonStore(state => state.pokemons);
	const unratedPokemons = usePokemonStore(useShallow(({pokemons, likedPokemons, dislikedPokemons}) => {
		return pokemons.filter(pokemon => !likedPokemons.has(pokemon.id) && !dislikedPokemons.has(pokemon.id)).slice(0, 4);
	}))


	useEffect(() => {
		if (unratedPokemons.length < CARDS_IN_DECK && !isLoading && hasMore) {
			console.log("fetching more pokemons")
			fetchPokemons()
		}
	}, [unratedPokemons]);


	const handleSwipeLeft = useCallback((id: number) => {
		dislikePokemon(id);
	}, [dislikePokemon]);

	const handleSwipeRight = useCallback((id: number) => {
		likePokemon(id);
	}, [likePokemon]);


	if (isLoading && unratedPokemons.length === 0) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" />
			</View>	
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.cardsContainer}>
				{unratedPokemons.map((pokemon, index) => (
					<Card
						key={pokemon.id}
						index={index}
						numberOfCards={unratedPokemons.length}
						onSwipeLeft={() => handleSwipeLeft(pokemon.id)}
						onSwipeRight={() => handleSwipeRight(pokemon.id)}
						pokemon={pokemon}
					/>
				))}
			</View>
			<Button title="Like" onPress={() => handleSwipeRight(unratedPokemons[0].id)} />
				<Button title="Run GC JS" onPress={() => global.gc()} />
		</View>
	);
};

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		backgroundColor: PlatformColor("systemBackground"),
		alignItems: "center",
		justifyContent: "center",
	},
	cardsContainer: {
		position: "relative",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		height: rt.screen.height * 0.4,
	},
}));
