import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '$env/static/private';
import countries from 'world-countries';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) redirect(302, '/login');

	const rows = await prisma.favorite.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: 'desc' },
		select: { cca3: true }
	});
	const favSet = new Set(rows.map((r) => r.cca3));

	const favorites = countries
		.filter((c) => favSet.has(c.cca3))
		.map((c) => ({
			name: c.name.common,
			flag: `https://flagcdn.com/${c.cca2.toLowerCase()}.svg`,
			region: c.region,
			capital: c.capital[0] ?? '—',
			cca3: c.cca3
		}));

	return { user: session.user, favorites };
};
