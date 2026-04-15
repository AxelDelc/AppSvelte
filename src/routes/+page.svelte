<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	let { data }: { data: PageData } = $props();
	let search = $state(page.url.searchParams.get('search') ?? '');
	let region = $state(page.url.searchParams.get('region') ?? '');
	let sort = $state(page.url.searchParams.get('sort') ?? 'name');

	let filtered = $derived(
		data.countries.filter(
			(country) =>
				country.name.common.toLowerCase().includes(search.toLowerCase()) &&
				(region === '' || country.region === region)
		)
	);
	let sorted = $derived(
		filtered.toSorted((a, b) => {
			if (sort === 'name') {
				return a.name.common.localeCompare(b.name.common);
			}
			if (sort === 'population') {
				return b.population - a.population;
			}
			return 0;
		})
	);

	$effect(() => {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (region) params.set('region', region);
		if (sort !== 'name') params.set('sort', sort);
		goto(`?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
	});
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Navbar -->
	<div class="flex items-center gap-4 bg-gray-500 px-6 py-4">
		<h1 class="text-xl font-bold text-white">Explorateur de pays</h1>
		<input
			type="text"
			bind:value={search}
			placeholder="Rechercher un pays..."
			class="rounded-lg px-4 py-2 text-gray-800 outline-none"
		/>
		<select bind:value={region} class="rounded-lg px-4 py-2 text-gray-800 outline-none">
			<option value="">Toutes les régions</option>
			<option value="Africa">Afrique</option>
			<option value="Americas">Amériques</option>
			<option value="Asia">Asie</option>
			<option value="Europe">Europe</option>
			<option value="Oceania">Océanie</option>
		</select>

		<select bind:value={sort} class="rounded-lg px-4 py-2 text-gray-800 outline-none">
			<option value="name">Trier par nom</option>
			<option value="population">Trier par population</option>
		</select>
	</div>

	<!-- Grille -->
	<div class="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each sorted as country}
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
		{/each}
	</div>
</div>
