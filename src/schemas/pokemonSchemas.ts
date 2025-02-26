import { z } from "zod";

export const PokemonListItemSchema = z.object({
	name: z.string(),
	url: z.string().url(),
});

export const PokemonListResponseSchema = z.object({
	count: z.number(),
	next: z.string().url().nullable(),
	previous: z.string().url().nullable(),
	results: z.array(PokemonListItemSchema),
});

export const PokemonSpritesSchema = z.object({
	other: z.object({
		"official-artwork": z.object({
			front_default: z.string().url().nullable(),
		}),
	}),
});

export const PokemonDetailSchema = z.object({
	id: z.number(),
	name: z.string(),
	base_experience: z.number().nullable(),
	sprites: PokemonSpritesSchema,
});

export type PokemonListResponse = z.infer<typeof PokemonListResponseSchema>;
export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
