import { ManufactureUser } from '../models/index.js';

export default { 
    async getAll(req, res) {
  try {
    const { filter, range, sort } = req.query;
    let parsedFilter = {};

    if (filter) {
      try {
        parsedFilter = JSON.parse(filter);
      } catch (e) {
        console.error('Error parsing filter:', e);
        return res.status(400).json({ error: 'Invalid filter format' });
      }
    } 
    let query = ManufactureUser.find(parsedFilter);
    

    if (range) {
      try {
        const [start, end] = JSON.parse(range);
        query = query.skip(start).limit(end - start + 1);
      } catch (e) {
        console.error('Error parsing range:', e);
      }
    }

    if (sort) {
      try {
        const [field, order] = JSON.parse(sort);
        query = query.sort({ [field]: order === 'ASC' ? 1 : -1 });
      } catch (e) {
        console.error('Error parsing sort:', e);
      }
    }

    const [items, total] = await Promise.all([
      query.exec(),
      ManufactureUser.countDocuments(parsedFilter),
    ]);

    res.set({
      'Content-Range': `manufacture_user 0-${items.length - 1}/${total}`,
      'Access-Control-Expose-Headers': 'Content-Range',
    });

    res.json(
      items.map((item) => ({
        id: item._id.toString(),
        ...item.toObject(),
      }))
    );
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
},


  // Получить один документ по id
  async getOne(req, res) {
    try {
      const doc = await ManufactureUser.findById(req.params.id).lean();
      if (!doc) return res.status(404).json({ error: 'Not found' });

      doc.id = doc._id.toString();
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Создать новый документ
  async create(req, res) {
    try {
      const newDoc = new ManufactureUser(req.body);
      const savedDoc = await newDoc.save();

      const docObj = savedDoc.toObject();
      docObj.id = docObj._id.toString();

      res.status(201).json(docObj);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Обновить документ по id
  async update(req, res) {
    try {
      const updatedDoc = await ManufactureUser.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
      if (!updatedDoc) return res.status(404).json({ error: 'Not found' });

      updatedDoc.id = updatedDoc._id.toString();
      res.json(updatedDoc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить документ по id
  async remove(req, res) {
    try {
      const deletedDoc = await ManufactureUser.findByIdAndDelete(req.params.id).lean();
      if (!deletedDoc) return res.status(404).json({ error: 'Not found' });

      deletedDoc.id = deletedDoc._id.toString();
      res.json(deletedDoc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
