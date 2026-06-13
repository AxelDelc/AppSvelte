import type { PageServerLoad } from './$types';
import { getCountries } from '$lib/server/test';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	return {
		...(await getCountries()),
		user: session?.user ?? null,
	};
};
