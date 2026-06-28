import type { PageServerLoad } from './$types'
import { getCountries } from '$lib/server/test'
import { auth } from '$lib/server/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { DATABASE_URL } from '$env/static/private'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers })
	const favorites = session
		? await prisma.favorite
				.findMany({ where: { userId: session.user.id }, select: { cca3: true } })
				.then((rows) => rows.map((r) => r.cca3))
		: []
	return {
		...(await getCountries()),
		user: session?.user ?? null,
		favorites,
	}
}
