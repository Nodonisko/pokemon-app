import { View, Text, PlatformColor, Platform } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Card } from "../components/Card";
import { useState } from "react";

const initialCards = [
	{
		id: 1,
	},
	{
		id: 2,
	},
	{
		id: 3,
	},
	{
		id: 4,
	},
	{
		id: 5,
	},
	{
		id: 6,
	},
];

export const HomeScreen = () => {
	const [cards, setCards] = useState(initialCards);

	console.log(cards);

	const removeFirstCard = () => {
		setCards((prevCards) => [...prevCards.slice(1), { id: Math.random() }]);
	};

	const handleSwipeLeft = (index: number) => {
		removeFirstCard();
	};

	const handleSwipeRight = (index: number) => {
		removeFirstCard();
	};

	return (
		<View style={styles.container}>
			<View style={styles.cardsContainer}>
				{cards.map((card, index) => (
					<Card
						key={card.id}
						index={index}
						numberOfCards={cards.length}
						onSwipeLeft={() => handleSwipeLeft(index)}
						onSwipeRight={() => handleSwipeRight(index)}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		backgroundColor: PlatformColor("systemBackground"),
		alignItems: "center",
		justifyContent: "center",
	},
	cardsContainer: {
		position: "relative",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		height: rt.screen.height * 0.4,
	},
}));
