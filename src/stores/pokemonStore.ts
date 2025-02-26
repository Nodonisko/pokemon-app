import { create } from "zustand";
import {
	PokemonListResponseSchema,
	PokemonDetailSchema,
} from "../schemas/pokemonSchemas";

export const CARDS_IN_DECK = 4;

export type Pokemon = {
	id: number;
	name: string;
	base_experience: number | null;
	imageUrl?: string | null;
};

interface PokemonStore {
	pokemons: Pokemon[];
	isLoading: boolean;
	error: string | null;
	offset: number;
	limit: number;
	hasMore: boolean;
	likedPokemons: Set<number>;
	dislikedPokemons: Set<number>;
	fetchPokemons: () => Promise<void>;
	resetStore: () => void;
	likePokemon: (id: number) => void;
	dislikePokemon: (id: number) => void;
}

export const usePokemonStore = create<PokemonStore>((set, get) => ({
	pokemons: [],
	isLoading: false,
	error: null,
	offset: 0,
	limit: 60,
	hasMore: true,
	likedPokemons: new Set<number>(),
	dislikedPokemons: new Set<number>(),

	fetchPokemons: async () => {
		const { offset, limit, pokemons } = get();
		console.log("fetching pokemons", offset, limit);
		try {
			set({ isLoading: true, error: null });

			const response = await fetch(
				`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
			);
			const rawData = await response.json();

			const validationResult = PokemonListResponseSchema.safeParse(rawData);

			if (!validationResult.success) {
				throw new Error(
					`Invalid API response: ${validationResult.error.message}`,
				);
			}

			const data = validationResult.data;

			// Fetch detailed information for each pokemon
			const pokemonDetails: Array<Pokemon | null> = await Promise.all(
				data.results.map(async (pokemon) => {
					try {
						const res = await fetch(pokemon.url);
						const rawPokemonData = await res.json();

						// Validate the pokemon detail response
						const detailValidation =
							PokemonDetailSchema.safeParse(rawPokemonData);

						if (!detailValidation.success) {
							console.error(
								`Invalid pokemon data for ${pokemon.name}:`,
								detailValidation.error,
							);
							return null;
						}

						const { id, name, base_experience, sprites } =
							detailValidation.data;

						// Pokemon detail is quite huge, so extract only the necessary data
						return {
							id: id,
							name: name,
							base_experience: base_experience,
							imageUrl: sprites.other["official-artwork"].front_default,
						};
					} catch (error) {
						console.error(
							`Failed to fetch details for ${pokemon.name}:`,
							error,
						);
						return null;
					}
				}),
			);

			// Filter out any null values from failed validations
			const validPokemonDetails = pokemonDetails.filter(
				(pokemon): pokemon is NonNullable<typeof pokemon> => pokemon !== null,
			);

			set({
				pokemons: [...pokemons, ...validPokemonDetails],
				offset: offset + limit,
				hasMore: data.next !== null,
				isLoading: false,
			});
		} catch (error) {
			console.error("Pokemon fetch error:", error);
			set({
				error:
					error instanceof Error ? error.message : "Failed to fetch pokemons",
				isLoading: false,
			});
		}
	},

	likePokemon: (id: number) => {
		const { likedPokemons, dislikedPokemons } = get();
		const newLiked = new Set(likedPokemons);
		const newDisliked = new Set(dislikedPokemons);
		newLiked.add(id);
		newDisliked.delete(id);
		set({ likedPokemons: newLiked, dislikedPokemons: newDisliked });
	},

	dislikePokemon: (id: number) => {
		const { dislikedPokemons, likedPokemons } = get();
		const newDisliked = new Set(dislikedPokemons);
		const newLiked = new Set(likedPokemons);
		newDisliked.add(id);
		newLiked.delete(id);
		set({ dislikedPokemons: newDisliked, likedPokemons: newLiked });
	},

	resetStore: () => {
		set({
			pokemons: [],
			isLoading: false,
			error: null,
			offset: 0,
			hasMore: true,
			likedPokemons: new Set<number>(),
			dislikedPokemons: new Set<number>(),
		});
	},
}));
