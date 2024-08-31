import express,{Express} from 'express'
import rootRouter from './routes/root';
import cors from 'cors'
import dotenv from 'dotenv'



dotenv.config()

const app:Express = express();
app.use(cors());
app.use(express.json())

app.use('/api/v1',rootRouter)

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})