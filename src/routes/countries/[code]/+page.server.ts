import { error } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { auth } from '$lib/server/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { DATABASE_URL } from '$env/static/private'
import countries from 'world-countries'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })

export const load: PageServerLoad = async ({ params, request }) => {
	const raw = countries.find((c) => c.cca3 === params.code)
	if (!raw) error(404, 'Pays introuvable')

	const session = await auth.api.getSession({ headers: request.headers })

	const [popRes, favoriteRow] = await Promise.all([
		fetch(`https://countriesnow.space/api/v0.1/countries/population/q?iso3=${params.code}`).catch(
			() => null
		),
		session
			? prisma.favorite.findUnique({
					where: { userId_cca3: { userId: session.user.id, cca3: params.code } },
					select: { id: true },
				})
			: null,
	])

	const popData = popRes?.ok ? await popRes.json() : null
	const population: number = popData?.data?.populationCounts?.at(-1)?.value ?? 0

	return {
		country: {
			name: raw.name,
			flags: { svg: `https://flagcdn.com/${raw.cca2.toLowerCase()}.svg` },
			population,
			region: raw.region,
			capital: raw.capital,
			languages: raw.languages,
			currencies: raw.currencies,
			borders: raw.borders,
			cca3: raw.cca3,
		},
		user: session?.user ?? null,
		isFavorite: !!favoriteRow,
	}
}

export const actions: Actions = {
	toggleFavorite: async ({ params, request }) => {
		const session = await auth.api.getSession({ headers: request.headers })
		if (!session) error(401, 'Non authentifié')

		const cca3 = params.code
		const existing = await prisma.favorite.findUnique({
			where: { userId_cca3: { userId: session.user.id, cca3 } },
			select: { id: true },
		})

		if (existing) {
			await prisma.favorite.delete({ where: { userId_cca3: { userId: session.user.id, cca3 } } })
		} else {
			await prisma.favorite.create({ data: { userId: session.user.id, cca3 } })
		}
	},
}
