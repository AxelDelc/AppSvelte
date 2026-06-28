<script lang="ts">
	import { signUp, useSession } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	const session = useSession();
	$effect(() => {
		if ($session.data) goto('/');
	});

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;
		const { error: err } = await signUp.email({ name, email, password, callbackURL: '/' });
		if (err) error = err.message ?? "Erreur lors de l'inscription.";
		loading = false;
	}
</script>

<div class="min-h-screen bg-gray-100">
	<div class="flex items-center gap-4 bg-gray-500 px-6 py-4">
		<a href="/" class="text-xl font-bold text-white">Explorateur de pays</a>
	</div>

	<div class="flex items-center justify-center px-4 py-16">
		<div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
			<h1 class="mb-1 text-2xl font-bold text-gray-800">Créer un compte</h1>
			<p class="mb-6 text-sm text-gray-500">Remplissez le formulaire pour vous inscrire.</p>

			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
				<div class="flex flex-col gap-1">
					<label for="name" class="text-sm font-medium text-gray-700">Nom</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						required
						placeholder="Jean Dupont"
						class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label for="email" class="text-sm font-medium text-gray-700">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						placeholder="vous@exemple.com"
						class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label for="password" class="text-sm font-medium text-gray-700">Mot de passe</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						placeholder="••••••••"
						class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
					/>
				</div>

				{#if error}
					<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
				>
					{loading ? 'Inscription...' : "S'inscrire"}
				</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500">
				Déjà un compte ?
				<a href="/login" class="font-medium text-gray-800 hover:underline">Se connecter</a>
			</p>
		</div>
	</div>
</div>
