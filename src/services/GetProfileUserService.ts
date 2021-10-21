import prismaClient from "../prisma"

class GetProfileUserService {
    async execute(user_id: string) {
        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            },
            select: {
                avatar_url: true,
                name: true
            }
        })

        return user
    }
}

export { GetProfileUserService }