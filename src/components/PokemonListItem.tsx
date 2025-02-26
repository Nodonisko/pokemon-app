import { Pokemon, usePokemonStore } from "../stores/pokemonStore";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Image } from "expo-image";
import { useUnistyles } from "react-native-unistyles";
import React from "react";

export const ITEM_HEIGHT = 100;

export const PokemonListItem = React.memo(({ pokemon }: { pokemon: Pokemon }) => {
    const {theme} = useUnistyles();
    const dislikePokemon = usePokemonStore((state) => state.dislikePokemon);

	return (
		<View style={styles.container}>
            <Image source={{ uri: pokemon.imageUrl }} style={styles.image} contentFit="contain" />
			<Text style={styles.name}>{pokemon.name}</Text>
            <TouchableOpacity style={styles.likeIconContainer} onPress={() => dislikePokemon(pokemon.id)}>
                <Image source={require("../assets/heart.fill.svg")} style={styles.likeIcon} contentFit="contain"  tintColor={theme.colors.likeIcon}/>
            </TouchableOpacity>
		</View>
	);
});

const styles = StyleSheet.create((theme, rt) => ({
	container: {
        height: ITEM_HEIGHT,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 16,
        paddingLeft: rt.insets.left + 16,
        paddingRight: rt.insets.right + 16,
        flexDirection: "row",
        alignItems: "center"
	},
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "uppercase",
        paddingHorizontal: 16,
    },
    likeIconContainer: {
        marginLeft: "auto",
       
    },
    likeIcon: {
        width: 50,
        height: 50,
    }
}));
