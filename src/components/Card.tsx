import { View, Text, PlatformColor, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useMemo } from "react";
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

type CardProps = {
	index: number;
	numberOfCards: number;
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
};

const DECK_STACK_RANGE = 150;

export const Card = ({
	index,
	numberOfCards,
	onSwipeLeft,
	onSwipeRight,
}: CardProps) => {
	const translateX = useSharedValue(0);
	const rotateX = useDerivedValue(() => {
		return interpolate(translateX.value, [-100, 100], [-10, 10], "clamp");
	});
	const { rt } = useUnistyles();
	const swipeThreshold = rt.screen.width * 0.45;
	const gesture = useMemo(
		() =>
			Gesture.Pan()
				.onChange((event) => {
					translateX.value = event.translationX;
				})
				.onFinalize((event) => {
					"worklet";
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
			interpolate(index, [0, numberOfCards - 1], [0, 1], "clamp"),
		);
	}, [index, numberOfCards]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotate: `${rotateX.value}deg` },
				{ translateX: translateX.value },
				{ scale: interpolate(position.value, [0, 1], [1, 0.9]) },
			],
			opacity: interpolate(
				translateX.value,
				[-swipeThreshold, 0, swipeThreshold],
				[0.7, 1, 0.7],
				"clamp",
			),
			top: interpolate(position.value, [0, 1], [0, -75]),
			zIndex: numberOfCards - index,
			backgroundColor: interpolateColor(
				position.value,
				[0, 1],
				["#E1EACD", "#BAD8B6"],
			),
		};
	});

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View style={[styles.card, animatedStyle]}>
				<Text>Card {index}</Text>
			</Animated.View>
		</GestureDetector>
	);
};

const styles = StyleSheet.create((theme, rt) => ({
	card: {
		//backgroundColor: PlatformColor(Platform.OS === "ios" ? "quaternarySystemFill" : "?attr/colorControlHighlight"),
		borderRadius: 10,
		borderWidth: 3,
		borderColor: "red",
		//borderColor: PlatformColor(Platform.OS === "ios" ? "systemTeal" : "?attr/colorPrimary"),
		width: rt.screen.width * 0.7,
		height: "100%",
		padding: 10,
		position: "absolute",
	},
}));
