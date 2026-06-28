<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let isFavorite = $derived(data.isFavorite);
	let loading = $state(false);
</script>

<div class="min-h-screen bg-gray-100 p-8">
	<a
		href="/"
		class="mb-6 inline-block rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
	>
		Retour
	</a>

	<div class="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
		<div class="mb-6 flex items-start justify-between gap-4">
			<h1 class="text-3xl font-bold text-gray-800">{data.country.name.common}</h1>

			{#if data.user}
				<form
					method="POST"
					action="?/toggleFavorite"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update({ reset: false });
						};
					}}
				>
					<button
						type="submit"
						disabled={loading}
						class="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50
							{isFavorite
							? 'border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
							: 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}"
					>
						{isFavorite ? ' Dans vos favoris ' : 'Ajouter aux favoris'}
					</button>
				</form>
			{:else}
				<a
					href="/login"
					class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
				>
					Ajouter aux favoris
				</a>
			{/if}
		</div>

		<img
			src={data.country.flags.svg}
			alt="Drapeau de {data.country.name.common}"
			class="mb-6 w-48 rounded-lg shadow"
		/>

		<div class="grid grid-cols-2 gap-4 text-gray-700">
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="text-sm text-gray-500">Population</p>
				<p class="font-semibold">{data.country.population.toLocaleString()}</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="text-sm text-gray-500">Région</p>
				<p class="font-semibold">{data.country.region}</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="text-sm text-gray-500">Capitale</p>
				<p class="font-semibold">{data.country.capital}</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="text-sm text-gray-500">Langues</p>
				<p class="font-semibold">{Object.values(data.country.languages).join(', ')}</p>
			</div>
			<div class="col-span-2 rounded-lg bg-gray-50 p-4">
				<p class="text-sm text-gray-500">Monnaies</p>
				<p class="font-semibold">
					{Object.values(data.country.currencies)
						.map((c: any) => c.name)
						.join(', ')}
				</p>
			</div>
		</div>
	</div>
</div>
