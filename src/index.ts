import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors'
import "./types/express";

import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Express = express()

app.use(express.json())

app.use(cookieParser());
app.use(cors({
    origin: [

        'http://localhost:3001',

    ],
    credentials: true
}))


app.use('/api', rootRouter)

app.use(errorMiddleware)

export const prismaClient = new PrismaClient({
    log: ['query']
})




app.get('/', (req, res) => {
    res.json("sarver is working")
})



app.listen(PORT, () => { console.log(`App in  running localhost:${PORT}`) })