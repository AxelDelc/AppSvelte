import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import countries from 'world-countries'

export const load: PageServerLoad = async ({ params }) => {
	const raw = countries.find((c) => c.cca3 === params.code)
	if (!raw) error(404, 'Pays introuvable')

	const popRes = await fetch(
		`https://countriesnow.space/api/v0.1/countries/population/q?iso3=${params.code}`
	).catch(() => null)
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
	}
}
