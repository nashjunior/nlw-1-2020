import knex from '../database/connection';
import {Request, Response} from 'express'
class PointsController {
  async index (req: Request, res: Response) {
    const {city, uf, items} = req.query;
    const parsedItems = String(items).split(',').map(item => Number(item.trim()))
    if(city)
    {
      const points = await knex('points').join('points_items', 'points.id','=','points_items.point_id').where('city', String(city));
    }
    else if(uf){
      const points = await knex('points').join('points_items', 'points.id','=','points_items.point_id').where('uf',String(uf));
    }
    else if(items){
      const points = await knex('points').join('points_items', 'points.id','=','points_items.point_id').
                  whereIn('points_items.item_id' ,parsedItems);
    }
    else if (city && items && uf){
      const points = await knex('points').join('points_items', 'points.id','=','points_items.point_id').
                  whereIn('points_items.item_id' ,parsedItems).where('city', String(city)).where('uf',String(uf)).
                  distinct().select('points.*');
    }
    const points = await knex('points').join('points_items', 'points.id','=','points_items.point_id').
                  distinct().select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...points,
        image_url: `http://10.0.0.108:3333/uploads/${point.image}`
      }
    })

    return res.json(serializedPoints)
  }

  async show (req: Request, res: Response) {
    const {id} = req.params;
    const point  = await knex('points').where('id', id).first();
    if(!point){
      return res.status(400).json({error: 'Point not found'})
    }
    const items = await knex('items').join('points_items', 'items.id', '=', 'points_items.item_id').
                  where('points_items.point_id', id).select('title');

    const serializedPoints =  {
        ...point,
        image_url: `http://10.0.0.108:3333/uploads/${point.image}`
    }
    return res.json(serializedPoints);
  }

  async create (req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;
  
    const trx = await knex.transaction()
    try {
      const insertedIds = await trx('points').insert({
        image: req.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      }).returning('*');
    
      const point_id = Number(insertedIds.map(id => {return id.id}));
      const pointItems = items.split(',').map((item:string) => Number(item.trim())).map((item_id: Number) => {
        return {
          item_id, 
          point_id
        }
      })
      await trx('points_items').insert(pointItems)
      trx.commit();
      return res.json(insertedIds)
    }catch (error){
      trx.rollback()
      return res.json({error: error.message})
    }
    
  
     
  }
}

export default new PointsController();