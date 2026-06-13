<script lang="ts">
	import { signIn, signOut, useSession } from '$lib/auth-client'

	const session = useSession()

	let email = $state('')
	let password = $state('')
	let error = $state('')
	let loading = $state(false)

	async function handleSubmit(e: Event) {
		e.preventDefault()
		error = ''
		loading = true

		const { error: err } = await signIn.email({ email, password, callbackURL: '/' })

		if (err) {
			error = err.message ?? 'Email ou mot de passe incorrect.'
		}

		loading = false
	}
</script>

<div class="mb-4">
	<h1 class="text-2xl font-bold">Login</h1>
	<p class="text-gray-600">Sign in to your account to continue.</p>
</div>

<div>
	{#if $session.data}
		<p>{$session.data.user.name}</p>
		<button onclick={async () => await signOut()}>Sign Out</button>
	{:else}
		<form onsubmit={handleSubmit} class="flex flex-col gap-3">
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
				{loading ? 'Connexion...' : 'Se connecter'}
			</button>
		</form>
	{/if}
</div>
