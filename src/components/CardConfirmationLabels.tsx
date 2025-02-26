import React from "react";
import { Text } from "react-native";
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

type CardConfirmationLabelsProps = {
	translateX: SharedValue<number>;
	confirmationMarkThreshold: number;
	swipeConfirmationThreshold: number;
};

export const CardConfirmationLabels = React.memo(
	({
		translateX,
		confirmationMarkThreshold,
		swipeConfirmationThreshold,
	}: CardConfirmationLabelsProps) => {
		const confirmationLeftStyle = useAnimatedStyle(() => {
			return {
				opacity: interpolate(
					translateX.value + confirmationMarkThreshold,
					[-swipeConfirmationThreshold, 0],
					[1, 0],
					"clamp",
				),
				transform: [{ rotate: "-20deg" }],
				left: 32,
			};
		});

		const confirmationRightStyle = useAnimatedStyle(() => {
			return {
				opacity: interpolate(
					translateX.value - confirmationMarkThreshold,
					[0, swipeConfirmationThreshold],
					[0, 1],
					"clamp",
				),
				transform: [{ rotate: "20deg" }],
				right: 32,
			};
		});

		return (
			<>
				<Animated.View
					style={[styles.confirmationContainer, confirmationLeftStyle]}
				>
					<Text style={styles.confirmationIconText}>❌</Text>
				</Animated.View>
				<Animated.View
					style={[styles.confirmationContainer, confirmationRightStyle]}
				>
					<Text style={styles.confirmationIconText}>✅</Text>
				</Animated.View>
			</>
		);
	},
);

const styles = StyleSheet.create((theme, rt) => ({
	confirmationIconText: {
		fontSize: 64,
	},
	confirmationContainer: {
		position: "absolute",
		top: 32,
	},
}));
