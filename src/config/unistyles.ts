import { StyleSheet } from "react-native-unistyles";

const lightTheme = {
	colors: {
		cardBackground: "#A1E3F9",
		cardBackgroundDark: "#418FF9",
		xpIndicator: "#0000ff",
		likeIcon: "#ff0000",
	},
};

const appThemes = {
	light: lightTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
	settings: {
		initialTheme: "light",
	},
	themes: appThemes,
});
