<script lang="ts">
	import type { PageData } from './$types';
	import { signOut } from '$lib/auth-client';
	import { untrack } from 'svelte';
	let { data }: { data: PageData } = $props();

	let search = $state('');
	let region = $state('');
	let sort = $state('name');
	const pageSize = 28;
	let currentPage = $state(1);

	let favorites = $state(untrack(() => new Set(data.favorites)));

	async function toggleFavorite(cca3: string) {
		if (!data.user) return;
		const isFav = favorites.has(cca3);
		const method = isFav ? 'DELETE' : 'POST';
		favorites = new Set(isFav ? [...favorites].filter((c) => c !== cca3) : [...favorites, cca3]);
		await fetch('/api/favorites', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ cca3 })
		});
	}

	// Derived stores for filtering, sorting, and pagination
	let filtered = $derived(
		data.countries.filter(
			(country) =>
				country.name.common.toLowerCase().includes(search.toLowerCase()) &&
				(region === '' || country.region === region)
		)
	);

	// Sort the filtered countries based on the selected sort option
	let sorted = $derived(
		filtered.toSorted((a, b) => {
			if (sort === 'name') return a.name.common.localeCompare(b.name.common);
			if (sort === 'population') return b.population - a.population;
			return 0;
		})
	);

	// Paginate the sorted countries
	let paginated = $derived(sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize));
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Navbar -->
	<div class="flex items-center gap-4 bg-gray-500 px-6 py-4">
		<h1 class="text-xl font-bold text-white">Explorateur de pays</h1>

		<div class="mx-6 flex flex-1 items-center gap-3">
			<input
				type="text"
				bind:value={search}
				placeholder="Rechercher un pays..."
				class="flex-1 rounded-lg px-4 py-2 text-sm text-gray-800 outline-none"
			/>
			<select bind:value={region} class="rounded-lg px-3 py-2 text-sm text-gray-800 outline-none">
				<option value="">Toutes les régions</option>
				<option value="Africa">Afrique</option>
				<option value="Americas">Amériques</option>
				<option value="Asia">Asie</option>
				<option value="Europe">Europe</option>
				<option value="Oceania">Océanie</option>
			</select>
			<select bind:value={sort} class="rounded-lg px-3 py-2 text-sm text-gray-800 outline-none">
				<option value="name">Trier par nom</option>
				<option value="population">Trier par population</option>
			</select>
		</div>

		<div class="flex items-center gap-3">
			{#if data.user}
				<a
					href="/profile"
					title={data.user.name}
					class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white hover:bg-white/30"
				>
					{data.user.name.charAt(0).toUpperCase()}
				</a>
				<button
					onclick={async () => {
						await signOut();
						location.reload();
					}}
					class="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30"
				>
					Déconnexion
				</button>
			{:else}
				<a
					href="/login"
					class="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30"
				>
					Connexion
				</a>
				<a
					href="/register"
					class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
				>
					Inscription
				</a>
			{/if}
		</div>
	</div>

	<!-- Grille -->
	<div class="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each paginated as country (country.cca3)}
			<div class="relative">
				{#if data.user}
					<button
						onclick={() => toggleFavorite(country.cca3)}
						class="absolute top-3 right-3 z-10 text-xl leading-none"
						title={favorites.has(country.cca3) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
					>
						{favorites.has(country.cca3) ? '★' : '☆'}
					</button>
				{/if}
				<a href={`/countries/${country.cca3}`} class="block">
					<div class="rounded-xl bg-white p-4 text-center shadow transition-shadow hover:shadow-lg">
						<img
							src={country.flags.svg}
							alt="Drapeau de {country.name.common}"
							class="mx-auto mb-3 h-16 w-24 rounded object-contain"
						/>
						<p class="font-semibold text-gray-800">{country.name.common}</p>
						<p class="text-sm text-gray-500">{country.region}</p>
					</div>
				</a>
			</div>
		{/each}
		<div class="col-span-full flex justify-center">
			<button
				onclick={() => currentPage--}
				disabled={currentPage === 1}
				class="mx-2 rounded bg-gray-300 px-4 py-2 text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200"
			>
				Précédent
			</button>
			<span class="mx-2 text-gray-800">Page {currentPage}</span>
			<button
				onclick={() => currentPage++}
				disabled={currentPage * pageSize >= sorted.length}
				class="mx-2 rounded bg-gray-300 px-4 py-2 text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200"
			>
				Suivant
			</button>
		</div>
	</div>
</div>
