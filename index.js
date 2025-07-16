import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import cors from 'cors';


const app= express();

//connecting database

mongoose.connect('mongodb+srv://prakashgiri20540811:nov261997@cluster0.f6ltgpj.mongodb.net/shopify').then((val) => {
    app.listen(5000, ()=> {
    console.log('database connected and server is running');
});
}).catch((err) => {
    console.log(err);
})


//middleware
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend dev server
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));  
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true
}));

app.use(express.static('uploads'));


app.get('/', (req, res)=> {
    
    return res.status(200).json({
    message: 'welcome to backend'

   });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);







