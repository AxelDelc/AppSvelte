import type { PageServerLoad } from './$types';
import { getCountries } from '$lib/serveur/test.server';

export const load: PageServerLoad = async () => {
    return await getCountries();
};
