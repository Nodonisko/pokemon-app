import { useCallback, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useShallow } from "zustand/react/shallow";
import { Card } from "../components/Card";
import { CARDS_IN_DECK, usePokemonStore } from "../stores/pokemonStore";

export const AllPokemonScreen = () => {
	const likePokemon = usePokemonStore((state) => state.likePokemon);
	const dislikePokemon = usePokemonStore((state) => state.dislikePokemon);
	const fetchPokemons = usePokemonStore((state) => state.fetchPokemons);
	const isLoading = usePokemonStore((state) => state.isLoading);
	const hasMore = usePokemonStore((state) => state.hasMore);
	const unratedPokemons = usePokemonStore(
		useShallow(({ pokemons, likedPokemons, dislikedPokemons }) => {
			return pokemons
				.filter(
					(pokemon) =>
						!likedPokemons.has(pokemon.id) && !dislikedPokemons.has(pokemon.id),
				)
				.slice(0, 4);
		}),
	);

	useEffect(() => {
		if (unratedPokemons.length < CARDS_IN_DECK && !isLoading && hasMore) {
			fetchPokemons();
		}
	}, [unratedPokemons]);

	const handleSwipeLeft = useCallback(
		(id: number) => {
			dislikePokemon(id);
		},
		[dislikePokemon],
	);

	const handleSwipeRight = useCallback(
		(id: number) => {
			likePokemon(id);
		},
		[likePokemon],
	);

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
						onSwipeLeft={handleSwipeLeft}
						onSwipeRight={handleSwipeRight}
						pokemon={pokemon}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
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
