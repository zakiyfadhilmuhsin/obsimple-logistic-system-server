import { INestApplication } from "@nestjs/common";
import { FastifyInstance } from 'fastify';

export function fastifyInstance(app: INestApplication): void {
    const fastifyInstance: FastifyInstance = app.getHttpAdapter().getInstance()
    fastifyInstance
        .addHook('onRequest', async (req, res) => {
            req.socket['encrypted'] = process.env.NODE_ENV === 'production'
        })
        .decorateReply('setHeader', function (name: string, value: unknown) {
            this.header(name, value)
        })
        .decorateReply('end', function () {
            this.send('')
        })
}