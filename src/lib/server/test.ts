import countries from 'world-countries';

export async function getCountries() {
	const popRes = await fetch('https://countriesnow.space/api/v0.1/countries/population').catch(
		() => null
	);
	const popData: { iso3: string; populationCounts: { year: number; value: number }[] }[] =
		popRes?.ok ? ((await popRes.json()).data ?? []) : [];
	const popMap = new Map(popData.map((p) => [p.iso3, p.populationCounts.at(-1)?.value ?? 0]));

	const mapped = countries.map((c) => ({
		name: c.name,
		flags: { svg: `https://flagcdn.com/${c.cca2.toLowerCase()}.svg` },
		population: popMap.get(c.cca3) ?? 0,
		region: c.region,
		capital: c.capital,
		cca3: c.cca3
	}));
	return { countries: mapped };
}
