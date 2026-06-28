<script lang="ts">
	import { signIn, useSession } from '$lib/auth-client'
	import { goto } from '$app/navigation'

	const session = useSession()
	$effect(() => { if ($session.data) goto('/') })

	let email = $state('')
	let password = $state('')
	let error = $state('')
	let loading = $state(false)

	async function handleSubmit(e: Event) {
		e.preventDefault()
		error = ''
		loading = true
		const { error: err } = await signIn.email({ email, password, callbackURL: '/' })
		if (err) error = err.message ?? 'Email ou mot de passe incorrect.'
		loading = false
	}
</script>

<div class="min-h-screen bg-gray-100">
	<div class="flex items-center gap-4 bg-gray-500 px-6 py-4">
		<a href="/" class="text-xl font-bold text-white">Explorateur de pays</a>
	</div>

	<div class="flex items-center justify-center px-4 py-16">
		<div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
			<h1 class="mb-1 text-2xl font-bold text-gray-800">Connexion</h1>
			<p class="mb-6 text-sm text-gray-500">Entrez vos identifiants pour accéder à votre compte.</p>

			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
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
					{loading ? 'Connexion...' : 'Se connecter'}
				</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-500">
				Pas encore de compte ?
				<a href="/register" class="font-medium text-gray-800 hover:underline">S'inscrire</a>
			</p>
		</div>
	</div>
</div>
