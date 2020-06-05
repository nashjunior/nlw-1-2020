import express from 'express';
import * as controller from './controllers/ImportAll'
import multer from 'multer'
import multerConfig from './config/multerConfig';
import {celebrate, Joi} from 'celebrate'
const routes = express.Router();
const upload = multer(multerConfig)
routes.get('/items', controller.ItemsController.index);


//inserir novo pontoo de coleta
routes.post('/points', upload.single('image'),celebrate({
  body:Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    whatsapp: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    uf: Joi.string().required().max(2),
    city: Joi.string().required(),
    items: Joi.string().required(),
    
  },)
},{abortEarly:false}),controller.PointsController.create);
routes.get('/points/:id', controller.PointsController.show);
routes.get('/points/', controller.PointsController.index);

export default routes;