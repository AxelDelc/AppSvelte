<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let search = $state('');
	let region = $state('');
	let sort = $state('name');
	let filtered = $derived(
		data.countries.filter(
			(country) =>
				country.name.common.toLowerCase().includes(search.toLowerCase()) &&
				(region === '' || country.region === region)
		)
	);
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
	</div>

	<!-- Grille -->
	<div class="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each filtered as country}
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
