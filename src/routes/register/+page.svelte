<script lang="ts">
	import { signUp, signOut, useSession } from '$lib/auth-client';

	const session = useSession();

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

		if (err) {
			console.error('Better Auth error:', err)
			error = err.message ?? `Erreur ${err.status ?? ''} lors de l'inscription.`;
		}

		loading = false;
	}
</script>

<div class="mb-4">
	<h1 class="text-2xl font-bold">Register</h1>
	<p class="text-gray-600">Create an account to continue.</p>
</div>

<div>
	{#if $session.data}
		<p>{$session.data.user.name}</p>
		<button onclick={async () => await signOut()}>Sign Out</button>
	{:else}
		<form onsubmit={handleSubmit} class="flex flex-col gap-3">
			<div class="flex flex-col gap-1">
				<label for="name" class="text-sm font-medium">Nom</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					class="rounded border px-3 py-2"
				/>
			</div>

			<div class="flex flex-col gap-1">
				<label for="email" class="text-sm font-medium">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="rounded border px-3 py-2"
				/>
			</div>

			<div class="flex flex-col gap-1">
				<label for="password" class="text-sm font-medium">Mot de passe</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="rounded border px-3 py-2"
				/>
			</div>

			{#if error}
				<p class="text-sm text-red-500">{error}</p>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
			>
				{loading ? 'Inscription...' : "S'inscrire"}
			</button>
		</form>
	{/if}
</div>
