import express, { Express, Response, Request } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes/index.routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleWare } from './middlewares/errors';


// intialize the expres application
const app:Express = express();

app.use(express.json())


// initilize and export the prisma client
export const prismaClient = new PrismaClient({
    log: ["query"]
})


app.use(rootRouter)

app.use(errorMiddleWare)

// funtion to start the server
function startServer () {
    try {    
        app.listen(PORT, () => console.log("App working.."))
    } catch (error) {
        console.log("problem starting server", error)
    }
}

// start the server
startServer()