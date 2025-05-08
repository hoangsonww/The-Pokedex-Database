import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Pokedex } from '@/data/models/pokedex';
import { ItemList } from '@/data/models/item-list';
import PokemonCard from '@/components/PokemonCard';
import Pagination from '@/components/Pagination';
import ItemCard from '@/components/ItemCard';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

/**
 * Home page component
 *
 * @returns The JSX element
 */
export default function Home() {
  // States for the current page of Pokemon and Items and the favorites list
  const [pokemonPage, setPokemonPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const [favoritePage, setFavoritePage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Search input states for Pokemon, Items, and Favorites
  const [pokemonSearchInput, setPokemonSearchInput] = useState('');
  const [pokemonSearch, setPokemonSearch] = useState('');
  const [itemSearchInput, setItemSearchInput] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [favoriteSearchInput, setFavoriteSearchInput] = useState('');
  const [favoriteSearch, setFavoriteSearch] = useState('');

  /**
   * Extract the Pokemon ID from the URL
   *
   * @param url The URL of the Pokemon
   * @returns The ID of the Pokemon
   */
  function getPokemonIdFromUrl(url: string): string {
    // Each URL is like "https://pokeapi.co/api/v2/pokemon/1/" (I used chatgpt to help me with this regex)
    const match = url.match(/\/pokemon\/(\d+)\//);

    // If no match, return an empty string
    if (!match) return '';

    // Return the first capture group
    return match[1];
  }

  /**
   * Get the sprite URL for a given Pokemon ID
   *
   * @param id The ID of the Pokemon
   * @returns The URL of the sprite
   */
  function getPokemonSpriteUrl(id: string) {
    // For #1 -> "1.png", #2 -> "2.png", etc.
    // as every pokemon sprite is named by its ID (not by real name)
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  // Debounce effect for pokemon search input
  // Basically, my app wait for 200ms after the user stops typing to update the search query to avoid unnecessary API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setPokemonSearch(pokemonSearchInput.trim().toLowerCase());
    }, 200);

    return () => clearTimeout(handler);
  }, [pokemonSearchInput]);

  // Debounce effect for item search input
  // Basically, my app wait for 200ms after the user stops typing to update the search query to avoid unnecessary API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setItemSearch(itemSearchInput.trim().toLowerCase());
    }, 200);
    return () => clearTimeout(handler);
  }, [itemSearchInput]);

  // Debounce effect for favorite search input
  // Basically, my app wait for 200ms after the user stops typing to update the search query to avoid unnecessary API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setFavoriteSearch(favoriteSearchInput.trim().toLowerCase());
    }, 200);
    return () => clearTimeout(handler);
  }, [favoriteSearchInput]);

  // Reset pages to 1 when user types a new search query
  useEffect(() => {
    setPokemonPage(1);
  }, [pokemonSearch]);

  useEffect(() => {
    setItemPage(1);
  }, [itemSearch]);

  useEffect(() => {
    setFavoritePage(1);
  }, [favoriteSearch]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const favs = localStorage.getItem('favorites');

    if (favs) {
      setFavorites(JSON.parse(favs));
    }
  }, []);

  /**
   * Toggle the favorite status of a Pokemon
   *
   * @param pokemonName The name of the Pokemon
   */
  const handleToggleFavorite = (pokemonName: string) => {
    setFavorites((prev) => {
      // Create a copy of the old array
      let updatedFavorites = [...prev];

      // If the Pokemon is already in the favorites list, remove it
      // Otherwise, add it to the list
      if (updatedFavorites.includes(pokemonName)) {
        updatedFavorites = updatedFavorites.filter(
          (name) => name !== pokemonName
        );
      } else {
        updatedFavorites.push(pokemonName);
      }

      // Update localStorage in ALL cases
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  // Each page has 48 items
  const pokemonPageSize = 48;

  // Offset for the Pokemon list (used for pagination)
  // e.g. page 1 -> offset 0 (start at 1st item), page 2 -> offset 48 (start at 49th item), etc.
  const offsetPokemon = (pokemonPage - 1) * pokemonPageSize;

  /**
   * Pokemon query to fetch the list of pokemon (paginated)
   * FETCHING THIS DATA IN CLIENT SIDE
   */
  const {
    data: pokemonData,
    isLoading: pokemonLoading,
    error: pokemonError
  } = useQuery<Pokedex>({
    // The query key is an array with the query name and the current page
    queryKey: ['pokemonList', pokemonPage],

    queryFn: async () => {
      // Fetch the pokemons list from the PokeAPI
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPageSize}&offset=${offsetPokemon}`
      );

      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch pokemons list.');
      }

      // Return the data as a Pokedex object
      return (await response.json()) as Pokedex;
    }
  });

  /**
   * Query that fetches ALL Pokémon, so the favorites aren’t tied to the current page
   * FETCHING THIS DATA IN CLIENT SIDE
   */
  const { data: allPokemonData } = useQuery<Pokedex>({
    // The query key is the query name
    queryKey: ['allPokemonData'],

    queryFn: async () => {
      // Fetch all pokemons list from the PokeAPI
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
      );

      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch all pokemons list.');
      }

      // Return the data as a Pokedex object
      return (await response.json()) as Pokedex;
    }
  });

  // Each page has 48 items
  const itemPageSize = 48;

  // Offset for the Item list (used for pagination)
  // e.g. page 1 -> offset 0 (start at 1st item), page 2 -> offset 48 (start at 49th item), etc.
  const offsetItems = (itemPage - 1) * itemPageSize;

  /**
   * Item query to fetch the list of all items (paginated)
   * FETCHING THIS DATA IN CLIENT SIDE
   */
  const {
    data: itemData,
    isLoading: itemLoading,
    error: itemError
  } = useQuery<ItemList>({
    // The query key is an array with the query name and the current page
    queryKey: ['itemList', itemPage],

    queryFn: async () => {
      // Fetch the items list from the PokeAPI
      const response = await fetch(
        `https://pokeapi.co/api/v2/item?limit=${itemPageSize}&offset=${offsetItems}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch item list.');
      }

      // Return the data as a ItemList object
      return (await response.json()) as ItemList;
    }
  });

  /**
   * Query that fetches ALL items, so search is not limited to the current page
   */
  const { data: allItemData } = useQuery<ItemList>({
    // The query key is the query name
    queryKey: ['allItemData'],

    queryFn: async () => {
      // Fetch all items list from the PokeAPI
      const response = await fetch(
        `https://pokeapi.co/api/v2/item?limit=100000&offset=0`
      );

      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error('Failed to fetch all item list.');
      }

      // Return the data as a ItemList object
      return (await response.json()) as ItemList;
    }
  });

  // Total count of pokemons and items
  // pokemonData and itemData may be undefined, so we use optional chaining (?.) to access the count property
  // If the count is undefined, we default to 0
  const totalPokemonCount = pokemonData?.count ?? 0;
  const totalItemCount = itemData?.count ?? 0;

  /**
   * Filter the ALL Pokémon list to only include the favorites
   * I will then use this list to render the favorite pokemon list
   * No longer depends on the current page's partial results
   */
  const favoritePokemons = allPokemonData?.results.filter((p) =>
    favorites.includes(p.name)
  );

  // Paginate the favorite pokemons
  const favoritePageSize = 48;

  // Total count of favorite pokemons (fav pokemon list may be undefined, so we use optional chaining)
  const totalFavoriteCount = favoritePokemons?.length;

  // Offset for the favorite pokemons list (used for pagination)
  // e.g. page 1 -> offset 0 (start at 1st item), page 2 -> offset 48 (start at 49th item), etc.
  const offsetFavorites = (favoritePage - 1) * favoritePageSize;

  /**
   * Now, just like Pokémon and Items, if there's a search, we first filter the entire favorites list,
   * and only then apply pagination so users can see favorites across all pages.
   */
  // 1) Determine the "displayed" favorites (the entire array if no search, or filtered if there's a search)
  let displayedFavorites = favoritePokemons;
  if (favoriteSearch !== '') {
    displayedFavorites = displayedFavorites?.filter((p) =>
      p.name.toLowerCase().includes(favoriteSearch)
    );
  }

  // 2) Now we slice the displayedFavorites for pagination
  const paginatedFavorites = displayedFavorites?.slice(
    offsetFavorites,
    offsetFavorites + favoritePageSize
  );

  /**
   * Filter the Pokémon list. If there's a search, we filter from allPokemonData;
   * otherwise, we display the current page (paginated) pokemonData.
   */
  let displayedPokemon: Pokedex['results'] | undefined;
  if (pokemonSearch !== '') {
    displayedPokemon = allPokemonData?.results.filter((p) =>
      p.name.toLowerCase().includes(pokemonSearch)
    );
  } else {
    displayedPokemon = pokemonData?.results;
  }

  /**
   * We'll now slice the displayedPokemon to reflect the correct pagination,
   * if there's no search, we do it as normal from pokemonData.
   */
  let paginatedPokemon: Pokedex['results'] | undefined;
  if (pokemonSearch === '') {
    paginatedPokemon = displayedPokemon;
  } else {
    paginatedPokemon = displayedPokemon?.slice(
      offsetPokemon,
      offsetPokemon + pokemonPageSize
    );
  }

  /**
   * Filter the item list. If there's a search, we filter from allItemData;
   * otherwise, we display the current page (paginated) itemData.
   */
  let displayedItems: ItemList['results'] | undefined;
  if (itemSearch !== '') {
    displayedItems = allItemData?.results.filter((item) =>
      item.name.toLowerCase().includes(itemSearch)
    );
  } else {
    displayedItems = itemData?.results;
  }

  /**
   * We'll now slice the displayedItems to reflect the correct pagination,
   * if there's no search, we do it as normal from itemData.
   */
  let paginatedItems: ItemList['results'] | undefined;
  if (itemSearch === '') {
    paginatedItems = displayedItems;
  } else {
    // When searching across all items, we handle pagination here:
    paginatedItems = displayedItems?.slice(
      offsetItems,
      offsetItems + itemPageSize
    );
  }

  // Count how many Pokémon/Items/Favorites are displayed after filtering
  const displayedPokemonCount = displayedPokemon?.length ?? 0;
  const displayedItemCount = displayedItems?.length ?? 0;
  const displayedFavoritesCount = displayedFavorites?.length ?? 0;

  // Here, we render the Pokemon and Item lists
  // Using framer-motion's layout animation to animate the grid to make the ui/ux smoother and look better
  return (
    <div className="space-y-10">
      {/* pokemon list */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-3xl font-bold">⚡ Pokémon</h2>

          {/* Search bar for pokemon, on the same line on desktop */}
          <div className="relative mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              value={pokemonSearchInput}
              onChange={(e) => setPokemonSearchInput(e.target.value)}
              placeholder="Search Pokémon..."
              className="w-full sm:w-auto px-3 py-2 pr-10 border border-gray-300 
                        dark:border-gray-600 dark:bg-gray-700 rounded focus:outline-none
                        focus:ring-2 focus:ring-primary text-gray-700 dark:text-gray-100
                        transition"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Loading spinner if data is loading */}
        {pokemonLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Loading, error (for edge cases), or pokemon list (if load successfully) */}
        {pokemonLoading ? null : pokemonError ? (
          <div className="text-red-500">{String(pokemonError)}</div>
        ) : (
          <>
            {/* pokemons grid with layout animation */}
            <motion.div
              layout
              transition={{ duration: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedPokemon?.map((p) => {
                const pokemonId = getPokemonIdFromUrl(p.url);
                return (
                  <PokemonCard
                    key={p.name}
                    name={p.name}
                    spriteUrl={
                      pokemonId ? getPokemonSpriteUrl(pokemonId) : undefined
                    }
                    isFavorite={favorites.includes(p.name)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                );
              })}
            </motion.div>

            {/* Pagination component */}
            <Pagination
              currentPage={pokemonPage}
              totalCount={
                pokemonSearch ? displayedPokemonCount : totalPokemonCount
              }
              pageSize={pokemonPageSize}
              onPageChange={(newPage) => setPokemonPage(newPage)}
            />
          </>
        )}
      </section>

      {/* Item List */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-3xl font-bold">🎒 Items</h2>

          {/* Search bar for Items, on the same line on desktop */}
          <div className="relative mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              value={itemSearchInput}
              onChange={(e) => setItemSearchInput(e.target.value)}
              placeholder="Search Pokémon..."
              className="w-full sm:w-auto px-3 py-2 pr-10 border border-gray-300 
                        dark:border-gray-600 dark:bg-gray-700 rounded focus:outline-none
                        focus:ring-2 focus:ring-primary text-gray-700 dark:text-gray-100
                        transition"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {itemLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Loading, error (for edge cases), or item list (if load successfully) */}
        {itemLoading ? null : itemError ? (
          <div className="text-red-500">{String(itemError)}</div>
        ) : (
          <>
            <motion.div
              layout
              transition={{ duration: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedItems?.map((item) => {
                const itemSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`;
                return (
                  <ItemCard
                    key={item.name}
                    name={item.name}
                    spriteUrl={itemSpriteUrl}
                  />
                );
              })}
            </motion.div>

            <Pagination
              currentPage={itemPage}
              totalCount={itemSearch ? displayedItemCount : totalItemCount}
              pageSize={itemPageSize}
              onPageChange={(newPage) => setItemPage(newPage)}
            />
          </>
        )}
      </section>

      {/* Favorite pokemon Section with Pagination */}
      {favorites.length > 0 && (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-3xl font-bold">⭐ Favorite Pokémon</h2>

            {/* Search bar for favorite pokemon list */}
            <div className="relative mt-2 sm:mt-0 w-full sm:w-auto">
              <input
                type="text"
                value={favoriteSearchInput}
                onChange={(e) => setFavoriteSearchInput(e.target.value)}
                placeholder="Search Pokémon..."
                className="w-full sm:w-auto px-3 py-2 pr-10 border border-gray-300 
                          dark:border-gray-600 dark:bg-gray-700 rounded focus:outline-none
                          focus:ring-2 focus:ring-primary text-gray-700 dark:text-gray-100
                          transition"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <motion.div
            layout
            transition={{ duration: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedFavorites?.map((p) => {
              const pokemonId = getPokemonIdFromUrl(p.url);
              return (
                <PokemonCard
                  key={p.name}
                  name={p.name}
                  spriteUrl={getPokemonSpriteUrl(pokemonId)}
                  isFavorite={favorites.includes(p.name)}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })}
          </motion.div>

          {/* Pagination for Favorites */}
          <Pagination
            currentPage={favoritePage}
            totalCount={
              favoriteSearch
                ? displayedFavoritesCount
                : (totalFavoriteCount ?? 0)
            }
            pageSize={favoritePageSize}
            onPageChange={(newPage) => setFavoritePage(newPage)}
          />
        </section>
      )}
    </div>
  );
}
