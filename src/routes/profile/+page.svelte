<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-gray-100">
	<div class="flex items-center gap-4 bg-gray-500 px-6 py-4">
		<h1 class="text-xl font-bold text-white">Explorateur de pays</h1>
		<a
			href="/"
			class="ml-auto rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/30"
			>← Retour</a
		>
	</div>

	<div class="mx-auto max-w-4xl px-4 py-10">
		<div class="mb-8 rounded-xl bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-bold text-gray-800">Mon profil</h2>
			<div class="flex items-center gap-4">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-600"
				>
					{data.user.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<p class="font-semibold text-gray-800">{data.user.name}</p>
					<p class="text-sm text-gray-500">{data.user.email}</p>
				</div>
			</div>
		</div>

		<h2 class="mb-4 text-xl font-bold text-gray-800">
			Mes favoris
			<span class="ml-2 rounded-full bg-gray-200 px-2.5 py-0.5 text-sm font-medium text-gray-600"
				>{data.favorites.length}</span
			>
		</h2>

		{#if data.favorites.length === 0}
			<div class="rounded-xl bg-white p-10 text-center shadow">
				<p class="text-gray-500">Aucun favori pour l'instant.</p>
				<a href="/" class="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
					>Explorer les pays →</a
				>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.favorites as country (country.cca3)}
					<a
						href="/countries/{country.cca3}"
						class="flex items-center gap-3 rounded-xl bg-white p-4 shadow transition-shadow hover:shadow-md"
					>
						<img
							src={country.flag}
							alt="Drapeau {country.name}"
							class="h-10 w-14 rounded object-cover shadow-sm"
						/>
						<div class="min-w-0">
							<p class="truncate font-semibold text-gray-800">{country.name}</p>
							<p class="text-sm text-gray-500">{country.capital} · {country.region}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
