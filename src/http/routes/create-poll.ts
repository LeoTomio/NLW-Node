import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createPoll(app: FastifyInstance) {

    app.post('/polls', async (request, reply) => {
        const createPollBody = z.object({
            title: z.string(),
            options: z.array(z.string()),
        })

        const { title, options } = createPollBody.parse(request.body)

        const poll = await prisma.poll.create({
            data: {
                title,
                options: {
                    //Quando eu to criando um registro que depende do pai dentro da propria criação do pai
                    //ele já insere automatico o id, por isso aqui nao foi preciso passar o pollId
                    createMany: {
                        data: options.map((option) => {
                            return {
                                title: option,
                            }
                        })
                    }
                }
            }
        })

        return reply.status(201).send({ pollId: poll.id })
    })
}