import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${params.code}?fields=name,flags,population,region,capital,languages,currencies,borders`);
    const data = await response.json();
    return { country: data };
};
