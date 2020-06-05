import knex from '../database/connection';
import {Request, Response} from 'express'
class ItemsController {
  async index(req: Request, res: Response) {
    //const items = String(req.query.search);
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://10.0.0.108:3333/uploads/${item.image}`
      }
    })
    return res.json(serializedItems)
  }
}

export default new ItemsController();
