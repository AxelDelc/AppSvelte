import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { DATABASE_URL } from '$env/static/private'

const adapter = new PrismaPg({ connectionString: DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
	},
})