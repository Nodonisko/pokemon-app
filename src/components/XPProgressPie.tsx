import {
	Canvas,
	Group,
	matchFont,
	Path,
	Skia,
	Text,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { useDerivedValue, withSpring } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const RADIUS = 25;
const STROKE_WIDTH = 5;
const CIRCLE_PATH = Skia.Path.Make().addCircle(
	-RADIUS - STROKE_WIDTH / 2,
	RADIUS + STROKE_WIDTH / 2,
	RADIUS,
);
// We need to add 1 otherwise circle may be cut off on some devices due to rounding errors
const CANVAS_SIZE = RADIUS * 2 + STROKE_WIDTH + 1;
const MAX_XP = 543;

const fontFamily = Platform.select({ ios: "Helvetica", default: "sans-serif" });
const fontStyle = {
	fontFamily,
	fontSize: 14,
};
const font = matchFont(fontStyle);

export const XPProgressPie = React.memo(
	({ isVisible, xp }: { isVisible: boolean; xp: number }) => {
		const { theme } = useUnistyles();
		const progress = useDerivedValue(() => {
			return isVisible ? withSpring(xp / MAX_XP) : 0;
		});

		const text = `${xp}xp`;
		const textDimensions = useMemo(() => font.measureText(text), [text]);

		return (
			<Canvas style={styles.container}>
				<Group transform={[{ rotate: -Math.PI / 2 }]}>
					<Path
						path={CIRCLE_PATH}
						color="lightGray"
						style="stroke"
						strokeWidth={STROKE_WIDTH}
						strokeCap="round"
					/>
					<Path
						path={CIRCLE_PATH}
						color={theme.colors.xpIndicator}
						style="stroke"
						strokeWidth={STROKE_WIDTH}
						strokeCap="round"
						end={progress}
					/>
				</Group>
				<Text
					x={CANVAS_SIZE / 2 - textDimensions.width / 2}
					y={CANVAS_SIZE / 2 + textDimensions.height / 3}
					text={text}
					font={font}
					color="black"
				/>
			</Canvas>
		);
	},
);

XPProgressPie.displayName = "XPProgressPie";

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		width: CANVAS_SIZE,
		height: CANVAS_SIZE,
	},
}));
