import { StyleSheet } from "react-native-unistyles";

const lightTheme = {
	colors: {
		primary: "#ff1ff4",
		secondary: "#1ff4ff",
	},
	gap: (v: number) => v * 8,
};

const otherTheme = {
	colors: {
		primary: "#aa12ff",
		secondary: "pink",
	},
	gap: (v: number) => v * 8,
};

const appThemes = {
	light: lightTheme,
	other: otherTheme,
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
