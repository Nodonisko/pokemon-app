import { Image } from "expo-image";
import React, { useMemo } from "react";
import {
    Platform,
    Text,
    View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CARDS_IN_DECK, Pokemon } from "../stores/pokemonStore";
import { XPProgressPie } from "./XPProgressPie";
import { CardConfirmationLabels } from "./CardConfirmationLabels";

type CardProps = {
	index: number;
	numberOfCards: number;
	onSwipeLeft: (pokemonId: number) => void;
	onSwipeRight: (pokemonId: number) => void;
	pokemon: Pokemon;
};

export const Card = React.memo(({ index, onSwipeLeft, onSwipeRight, pokemon }: CardProps) => {
	const translateX = useSharedValue(0);
	const { rt, theme } = useUnistyles();

		// The threshold for the swipe to be confirmed
		const swipeConfirmationThreshold = rt.screen.width * 0.45;
		// The threshold for the confirmation mark ✅ or ❌ to be visible
		const confirmationMarkThreshold = rt.screen.width * 0.05;

		const gesture = useMemo(
			() =>
				Gesture.Pan()
					.onChange((event) => {
						translateX.value = event.translationX;
					})
					.onFinalize((event) => {
						if (event.translationX > swipeConfirmationThreshold) {
							translateX.value = withSpring(rt.screen.width);
							runOnJS(onSwipeRight)(pokemon.id);
						} else if (event.translationX < -swipeConfirmationThreshold) {
							translateX.value = withSpring(-rt.screen.width);
							runOnJS(onSwipeLeft)(pokemon.id);
						} else {
							translateX.value = withSpring(0);
						}
					}),
			[pokemon.id, onSwipeRight, onSwipeLeft, swipeConfirmationThreshold, rt.screen.width],
		);

		const position = useDerivedValue(() => {
			return withTiming(
				interpolate(index, [0, CARDS_IN_DECK - 1], [0, 1], "clamp"),
			);
		}, [index]);

		const rotateX = useDerivedValue(() => {
			return interpolate(translateX.value, [-100, 100], [-10, 10], "clamp");
		});
		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [
					{ rotate: `${rotateX.value}deg` },
					{ translateX: translateX.value },
					{ scale: interpolate(position.value, [0, 1], [1, 0.8]) },
					// There seems to be bug in Reanimated types, so we need to add to const
				] as const,
				opacity: interpolate(
					translateX.value,
					[-swipeConfirmationThreshold, 0, swipeConfirmationThreshold],
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
					<Image
						source={{ uri: pokemon.imageUrl }}
						style={styles.image}
						contentFit="contain"
					/>
					<View style={styles.xpContainer}>
						<XPProgressPie
							isVisible={index === 0}
							xp={pokemon.base_experience}
						/>
					</View>
					<CardConfirmationLabels
						translateX={translateX}
						confirmationMarkThreshold={confirmationMarkThreshold}
						swipeConfirmationThreshold={swipeConfirmationThreshold}
					/>
				</Animated.View>
			</GestureDetector>
		);
	},
);

const styles = StyleSheet.create((theme, rt) => ({
	card: {
		borderRadius: 10,
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
		}),
	},

}));
