import { User } from '../models/index.js';
import { 
  parseQueryParams, 
  applyStandardFilters 
} from '../utils/filterHelpers.js';

export default {
  async list(req, res) {
    try {
      const { range, sort, filter } = parseQueryParams(req);
      const [start, end] = range;
      const [sortField, sortOrder] = sort;
      const parsedFilter = applyStandardFilters(filter);

      if (sortField === 'purchasesCount') {
        const aggregation = [
          { $match: parsedFilter },
          { $addFields: { 
            purchasesCount: { $size: { $ifNull: ["$PURCHASES", []] } } 
          }},
          { $sort: { purchasesCount: sortOrder === 'ASC' ? 1 : -1 } },
          { $skip: start },
          { $limit: end - start + 1 }
        ];

        const [items, total] = await Promise.all([
          User.aggregate(aggregation),
          User.countDocuments(parsedFilter)
        ]);

        const data = items.map(item => ({
          id: item._id?.toString() || item.ID,
          ...item
        }));

        res.set({
          'Content-Range': `users ${start}-${start + items.length - 1}/${total}`,
          'Access-Control-Expose-Headers': 'Content-Range'
        });
        return res.json(data);
      }

      const query = User.find(parsedFilter)
        .sort({ [sortField]: sortOrder === 'ASC' ? 1 : -1 })
        .skip(start)
        .limit(end - start + 1);

      const [items, total] = await Promise.all([
        query.exec(),
        User.countDocuments(parsedFilter)
      ]);

      const data = items.map(item => ({
        id: item.ID || item._id.toString(),
        ...item.toObject(),
        purchasesCount: item.PURCHASES?.length || 0
      }));

      res.set({
        'Content-Range': `users ${start}-${start + items.length - 1}/${total}`,
        'Access-Control-Expose-Headers': 'Content-Range'
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({
        id: user._id,
        ...user.toObject(),
        purchasesCount: user.PURCHASES?.length || 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};