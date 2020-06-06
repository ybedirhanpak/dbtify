import { Router } from 'express';

const route = Router();

route.get('/', async (req, res) => {
  res.send('Test OK !');
});

export default route;