import { create } from 'zustand'

export const CARDS_IN_DECK = 4

export type Pokemon = {
  id: number
  name: string
  base_experience: number
  height: number
  weight: number
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
}

interface PokemonStore {
  pokemons: Pokemon[]
  isLoading: boolean
  error: string | null
  offset: number
  limit: number
  hasMore: boolean
  likedPokemons: Set<number>
  dislikedPokemons: Set<number>
  fetchPokemons: () => Promise<void>
  resetStore: () => void
  likePokemon: (id: number) => void
  dislikePokemon: (id: number) => void
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
    const { offset, limit, pokemons } = get()
    console.log("fetching pokemons", offset, limit)
    try {
      set({ isLoading: true, error: null })
      
      // Fetch pokemon list
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      )
      const data = await response.json()

      // Fetch detailed information for each pokemon
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { url: string }) => {
          const res = await fetch(pokemon.url)
          return res.json()
        })
      )

      set({
        pokemons: [...pokemons, ...pokemonDetails],
        offset: offset + limit,
        hasMore: data.next !== null,
        isLoading: false,
      })
    } catch (error) {
      set({ 
        error: 'Failed to fetch pokemons', 
        isLoading: false 
      })
    }
  },

  likePokemon: (id: number) => {
    const { likedPokemons } = get()
    const newLiked = new Set(likedPokemons)
    newLiked.add(id)
    set({ likedPokemons: newLiked })
  },

  dislikePokemon: (id: number) => {
    const { dislikedPokemons } = get()
    const newDisliked = new Set(dislikedPokemons)
    newDisliked.add(id)
    set({ dislikedPokemons: newDisliked })
  },

  resetStore: () => {
    set({
      pokemons: [],
      isLoading: false,
      error: null,
      offset: 0,
      hasMore: true,
      likedPokemons: new Set<number>(),
      dislikedPokemons: new Set<number>()
    })
  }
}))
