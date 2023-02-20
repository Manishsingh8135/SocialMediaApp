import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import dotevn from "dotenv"
import multer from "multer";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";
import helmet from "helmet";
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import {register} from './controllers/auth.js'
import { verifyToken } from "./middleware/auth.js";

const app=express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotevn.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))

app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));


// file storage
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload = multer({storage});

// routes with files
app.post('/auth/register',upload.single('picture'),register)

//routes
app.use('/auth',authRoutes)
app.user('/users',userRoutes)

// MONGOOSE

const PORT = process.env.PORT || 6001;
mongoose

  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));