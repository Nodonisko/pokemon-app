import { LegendList } from "@legendapp/list";
import { View, Text, PlatformColor } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { usePokemonStore } from "../stores/pokemonStore";
import { useShallow } from "zustand/react/shallow";
import { PokemonListItem, ITEM_HEIGHT } from "../components/PokemonListItem";

export const FavouritesScreen = () => {
	const items = usePokemonStore(
		useShallow(({ likedPokemons, pokemons }) => {
			return pokemons.filter((pokemon) => likedPokemons.has(pokemon.id));
		}),
	);

	return (
		<LegendList
			contentContainerStyle={styles.container}
			data={items}
			renderItem={({ item }) => <PokemonListItem pokemon={item} />}
			estimatedItemSize={ITEM_HEIGHT}
			recycleItems
		/>
	);
};

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		paddingTop: rt.insets.top,
		width: "100%",
	},
}));
