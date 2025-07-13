import mongoose from 'mongoose';

export const parseQueryParams = (req) => {
  const range = req.query.range ? JSON.parse(req.query.range) : [0, 25];
  const sort = req.query.sort ? JSON.parse(req.query.sort) : ['_id', 'ASC'];
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  return { range, sort, filter };
};

export const applyStandardFilters = (filter) => {
  if (filter.id) {
    filter._id = Array.isArray(filter.id) 
      ? { $in: filter.id.map(id => new mongoose.Types.ObjectId(id)) }
      : new mongoose.Types.ObjectId(filter.id);
    delete filter.id;
  }
  return filter;
};