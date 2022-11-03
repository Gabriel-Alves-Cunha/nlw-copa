import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
	try {
		const user = await prisma.user.create({
			data: {
				name: "John Doe",
				email: "john.doe@email.com",
			},
		});

		const pool = await prisma.pool.create({
			data: {
				title: "Example pool",
				ownerId: user.id,
				code: "BOL123",

				participants: { create: { userId: user.id } },
			},
		});

		await prisma.game.create({
			data: {
				date: "2022-11-03T12:00:00.714Z",
				secondTeamCountryCode: "BR",
				firstTeamCountryCode: "DE",
			},
		});

		await prisma.game.create({
			data: {
				date: "2022-11-04T12:00:00.714Z",
				secondTeamCountryCode: "AR",
				firstTeamCountryCode: "BR",

				guesses: {
					create: {
						secondTeamPoints: 1,
						firstTeamPoints: 2,

						participant: {
							connect: { userId_poolId: { userId: user.id, poolId: pool.id } },
						},
					},
				},
			},
		});
	} catch (error) {
		console.error(error);
	}
}

seed();
