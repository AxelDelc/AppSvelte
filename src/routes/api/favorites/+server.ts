import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '$env/static/private';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

async function getUser(request: Request) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) error(401, 'Non authentifié');
	return session.user;
}

export const GET: RequestHandler = async ({ request }) => {
	const user = await getUser(request);
	const favorites = await prisma.favorite.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: 'desc' },
		select: { cca3: true }
	});
	return json(favorites.map((f) => f.cca3));
};

export const POST: RequestHandler = async ({ request }) => {
	const user = await getUser(request);
	const { cca3 } = await request.json();
	if (!cca3) error(400, 'cca3 manquant');
	const favorite = await prisma.favorite.create({ data: { userId: user.id, cca3 } });
	return json(favorite, { status: 201 });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const user = await getUser(request);
	const { cca3 } = await request.json();
	if (!cca3) error(400, 'cca3 manquant');
	await prisma.favorite.delete({ where: { userId_cca3: { userId: user.id, cca3 } } });
	return json({ ok: true });
};
