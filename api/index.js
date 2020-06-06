import { Router } from 'express';

//Routes
import test from './routes/test';


const route = Router();

route.use('/test', test);

export default route;


