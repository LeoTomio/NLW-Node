import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const app = fastify()

//criar um arquivo de context do prisma
const prisma = new PrismaClient()

//criar arquivo de rotas
app.post('/polls', async (request, reply) => {
    //criar arquivo de validator
    const createPollBody = z.object({
        title: z.string()
    })

    const { title } = createPollBody.parse(request.body)
    // criar um arquivo service

    const poll = await prisma.poll.create({
        data: {
            title
        }
    })

    return reply.status(201).send({ pollId: poll.id })
})


app.listen({ port: 3333 }).then(() => {
    console.log('Aplicação rodando na porta 3333')
})