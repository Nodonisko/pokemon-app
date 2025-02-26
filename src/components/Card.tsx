import {
	View,
	Text,
	PlatformColor,
	Platform,
	StyleProp,
	ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useEffect, useMemo, useState } from "react";
import Animated, {
	interpolate,
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { XPProgressPie } from "./XPProgressPie";
import { Image } from "expo-image";
import { CARDS_IN_DECK, Pokemon } from "../stores/pokemonStore";

type CardProps = {
	index: number;
	numberOfCards: number;
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
    pokemon: Pokemon;
};


export const Card = ({
	index,
	onSwipeLeft,
	onSwipeRight,
	pokemon,
}: CardProps) => {

    // const [counter, setCounter] = useState(0);
    // useEffect(() => {
    //     const i = setInterval(() => {
    //         setCounter(prev => prev + 1);
    //     }, 100);
    //     return () => clearInterval(i);
    // }, []);

	const translateX = useSharedValue(0);
	const rotateX = useDerivedValue(() => {
		return interpolate(translateX.value, [-100, 100], [-10, 10], "clamp");
	});
	const { rt, theme } = useUnistyles();
	const swipeThreshold = rt.screen.width * 0.45;

	const gesture = useMemo(
		() =>
			Gesture.Pan()
				.onChange((event) => {
					translateX.value = event.translationX;
				})
				.onFinalize((event) => {
					if (event.translationX > swipeThreshold) {
						translateX.value = withSpring(rt.screen.width);
						runOnJS(onSwipeLeft)();
					} else if (event.translationX < -swipeThreshold) {
						translateX.value = withSpring(-rt.screen.width);
						runOnJS(onSwipeRight)();
					} else {
						translateX.value = withSpring(0);
					}
				}),
		[],
	);

	const position = useDerivedValue(() => {
		return withTiming(
			interpolate(index, [0, CARDS_IN_DECK - 1], [0, 1], "clamp"),
		);
	}, [index]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotate: `${rotateX.value}deg` },
				{ translateX: translateX.value },
				{ scale: interpolate(position.value, [0, 1], [1, 0.8]) },
			],
			opacity: interpolate(
				translateX.value,
				[-swipeThreshold, 0, swipeThreshold],
				[0.7, 1, 0.7],
				"clamp",
			),
			top: interpolate(position.value, [0, 1], [0, -75]),
			zIndex: CARDS_IN_DECK - index + 1,
			backgroundColor: interpolateColor(
				position.value,
				[0, 1],
				[theme.colors.cardBackground, theme.colors.cardBackgroundDark],
			),
		};
	});

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View style={[styles.card, animatedStyle]}>
				<Text style={styles.pokemonName}>{pokemon.name}</Text>
				<Image source={{ uri: pokemon.sprites.other['official-artwork'].front_default }} style={styles.image} contentFit="contain" />
                <View style={styles.xpContainer}>
                    <XPProgressPie isVisible={index === 0} xp={pokemon.base_experience} />
                </View>
			</Animated.View>
		 </GestureDetector>
	);
};

const styles = StyleSheet.create((theme, rt) => ({
	card: {
		//backgroundColor: PlatformColor(Platform.OS === "ios" ? "quaternarySystemFill" : "?attr/colorControlHighlight"),
		borderRadius: 10,
		//borderWidth: 3,
		borderColor: "red",
		//borderColor: PlatformColor(Platform.OS === "ios" ? "systemTeal" : "?attr/colorPrimary"),
		width: rt.screen.width * 0.7,
		height: "100%",
		padding: 10,
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "80%",
		height: "80%",
		borderRadius: 10,
	},
    xpContainer: {
        bottom: 16,
		right: 16,
		position: "absolute",
    },
    pokemonName: {
        position: "absolute",
        left: 16,
        bottom: 24,
        fontSize: 22,
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: Platform.select({
            ios: "AmericanTypewriter",
            android: "sans-serif-condensed-medium",
        })
    }
}));
