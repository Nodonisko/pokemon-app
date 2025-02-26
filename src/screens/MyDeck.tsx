import { LegendList } from "@legendapp/list";
import { StyleSheet } from "react-native-unistyles";
import { useShallow } from "zustand/react/shallow";
import { ITEM_HEIGHT, PokemonListItem } from "../components/PokemonListItem";
import { usePokemonStore } from "../stores/pokemonStore";

export const MyDeckScreen = () => {
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
