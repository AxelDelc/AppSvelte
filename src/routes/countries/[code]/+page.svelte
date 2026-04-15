<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-gray-100 p-8">
	<a href="/" class="mb-6 inline-block rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
		← Retour
	</a>

	<div class="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
		<h1 class="mb-6 text-3xl font-bold text-gray-800">{data.country.name.common}</h1>

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
			<div class="rounded-lg bg-gray-50 p-4 col-span-2">
				<p class="text-sm text-gray-500">Monnaies</p>
				<p class="font-semibold">{Object.values(data.country.currencies).map((c: any) => c.name).join(', ')}</p>
			</div>
		</div>
	</div>
</div>
