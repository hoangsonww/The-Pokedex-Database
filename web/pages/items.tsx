import { useDeferredValue, useEffect, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import ItemDexCard from '@/components/ItemDexCard';
import LoadingState from '@/components/LoadingState';
import Pagination from '@/components/Pagination';
import SearchField from '@/components/SearchField';
import SurfaceCard from '@/components/SurfaceCard';
import { ItemList } from '@/data/models/item-list';
import { Item } from '@/data/models/item';

const ITEM_DEX_PAGE_SIZE = 24;

/**
 * Dedicated item database page.
 *
 * @returns The item dex page
 */
export default function ItemsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [sortMode, setSortMode] = useState<'name' | 'cost'>('name');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchInput.trim().toLowerCase());

  const { data: itemList } = useQuery<ItemList>({
    queryKey: ['allItemsDex'],
    queryFn: async () => {
      const response = await fetch(
        'https://pokeapi.co/api/v2/item?limit=100000&offset=0'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch items.');
      }

      return (await response.json()) as ItemList;
    }
  });

  const searchedItems =
    deferredSearch === ''
      ? (itemList?.results ?? [])
      : (itemList?.results.filter((item) =>
          item.name.includes(deferredSearch)
        ) ?? []);

  const pagedItemRefs = searchedItems.slice(
    (page - 1) * ITEM_DEX_PAGE_SIZE,
    page * ITEM_DEX_PAGE_SIZE
  );

  const itemQueries = useQueries({
    queries: pagedItemRefs.map((item) => ({
      queryKey: ['itemDexEntry', item.name],
      queryFn: async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/item/${item.name}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch item entry.');
        }

        return (await response.json()) as Item;
      }
    }))
  });

  useEffect(() => {
    setPage(1);
  }, [sortMode]);

  const loadedItems = itemQueries
    .map((query) => query.data)
    .filter((item): item is Item => Boolean(item));
  const isLoadingItems = itemQueries.some((query) => query.isLoading);
  const displayedItems = [...loadedItems].sort((left, right) => {
    if (sortMode === 'cost') {
      return right.cost - left.cost;
    }

    return left.name.localeCompare(right.name);
  });

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(236,72,153,0.15),rgba(255,255,255,0.95)_38%,rgba(245,158,11,0.12))] dark:bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(15,23,42,0.92)_38%,rgba(245,158,11,0.08))]">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primaryDark dark:text-pink-100">
              Item database
            </p>
            <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
              Browse held items, battle tools, and collectibles in a dedicated
              dex.
            </h1>
            <p className="max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              Search the full item catalog, sort by cost, and open richer item
              profiles without hunting through the home page.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Indexed items
              </p>
              <p className="mt-2 text-3xl font-bold">{itemList?.count ?? 0}</p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Sort mode
              </p>
              <p className="mt-2 text-3xl font-bold capitalize">{sortMode}</p>
            </SurfaceCard>
            <SurfaceCard className="bg-white/80 p-4 dark:bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Results now
              </p>
              <p className="mt-2 text-3xl font-bold">{displayedItems.length}</p>
            </SurfaceCard>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Search items
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Find battle gear and utility tools
            </h2>
          </div>
          <SearchField
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value);
              setPage(1);
            }}
            placeholder="Search items..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortMode('name')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              sortMode === 'name'
                ? 'bg-primary text-white'
                : 'border border-primary/20 bg-white text-primaryDark hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800'
            }`}>
            Sort by name
          </button>
          <button
            onClick={() => setSortMode('cost')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              sortMode === 'cost'
                ? 'bg-primary text-white'
                : 'border border-primary/20 bg-white text-primaryDark hover:border-primary/40 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-900 dark:text-pink-100 dark:hover:bg-slate-800'
            }`}>
            Sort by cost
          </button>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.32fr]">
        <SurfaceCard className="space-y-6">
          {isLoadingItems ? (
            <LoadingState label="Loading items" />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {displayedItems.map((item) => (
                  <ItemDexCard key={item.name} item={item} />
                ))}
              </div>
              {displayedItems.length === 0 && (
                <p className="rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-4 py-6 text-sm text-slate-600 dark:text-slate-300">
                  No items matched that search on this page.
                </p>
              )}
            </>
          )}

          <Pagination
            currentPage={page}
            totalCount={searchedItems.length}
            pageSize={ITEM_DEX_PAGE_SIZE}
            onPageChange={setPage}
          />
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <ArchiveBoxIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Catalog first</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Items now live in a dedicated searchable database instead of being
              buried under the home page list.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Sort by value</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Cost sorting is useful when you want to skim the highest-value
              battle items or rare economy-heavy entries quickly.
            </p>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <div className="flex items-center gap-3">
              <Squares2X2Icon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Reference mode</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              This page is meant to work like a database index, not just another
              decorative card section.
            </p>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
