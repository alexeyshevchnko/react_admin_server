import {
  parseQueryParams,
  applyStandardFilters,
} from '../utils/filterHelpers.js';
import { formatResponse } from '../utils/responseHelpers.js';

export const createStandardController = (model, resourceName, options = {}) => {
  const { populate = [], useAggregate = false, aggregatePipeline = [] } = options;

  const applyPopulate = (query) => {
    populate.forEach((field) => {
      query.populate(field);
    });
    return query;
  };

  return {
    async list(req, res) {
      try {
        const { range, sort, filter } = parseQueryParams(req);
        const [start, end] = range;
        const [sortField, sortOrder] = sort;
        const parsedFilter = applyStandardFilters(filter);
        const limit = end - start + 1;

        let items, total;

        if (useAggregate) {
          // Собираем агрегированный pipeline
          const pipeline = [
            ...(aggregatePipeline.length > 0 ? aggregatePipeline : []),
            { $match: parsedFilter },
            ...(populate.length > 0
              ? populate.map((p) => ({
                  $lookup: {
                    from: p.from,
                    localField: p.localField,
                    foreignField: p.foreignField,
                    as: p.as || p.localField,
                  },
                }))
              : []),
            { $sort: { [sortField]: sortOrder === 'ASC' ? 1 : -1 } },
            { $skip: start },
            { $limit: limit },
          ];

          const countPipeline = [
            ...(aggregatePipeline.length > 0 ? aggregatePipeline : []),
            { $match: parsedFilter },
            { $count: 'total' },
          ];

          const [result, countResult] = await Promise.all([
            model.aggregate(pipeline),
            model.aggregate(countPipeline),
          ]);

          items = result;
          total = countResult.length > 0 ? countResult[0].total : 0;
        } else {
          let query = model.find(parsedFilter)
            .sort({ [sortField]: sortOrder === 'ASC' ? 1 : -1 })
            .skip(start)
            .limit(limit);

          query = applyPopulate(query);

          [items, total] = await Promise.all([
            query.exec(),
            model.countDocuments(parsedFilter),
          ]);
        }

        const { data, headers } = formatResponse(items, total, range, resourceName);
        res.set(headers).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async getOne(req, res) {
      try {
        let query = model.findById(req.params.id);
        query = applyPopulate(query);
        const item = await query.exec();

        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json({ id: item._id.toString(), ...item.toObject() });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async create(req, res) {
      try {
        const item = new model({
          ...req.body,
          created_at: Math.floor(Date.now() / 1000),
        });
        await item.save();
        res.status(201).json({ id: item._id.toString(), ...item.toObject() });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    async update(req, res) {
      try {
        const item = await model.findByIdAndUpdate(
          req.params.id,
          { ...req.body, updated_at: Math.floor(Date.now() / 1000) },
          { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json({ id: item._id.toString(), ...item.toObject() });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },

    async delete(req, res) {
      try {
        const item = await model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json({ id: item._id.toString(), ...item.toObject() });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  };
};
