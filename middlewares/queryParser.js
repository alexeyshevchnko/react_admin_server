export const parseQueryParams = (req, res, next) => {
  const range = req.query.range ? JSON.parse(req.query.range) : [0, 25];
  const sort = req.query.sort ? JSON.parse(req.query.sort) : ['_id', 'ASC'];
  let filter = req.query.filter ? JSON.parse(req.query.filter) : {};

  if (filter.id) {
    filter._id = Array.isArray(filter.id) 
      ? { $in: filter.id } 
      : filter.id;
    delete filter.id;
  }

  req.parsedQuery = { range, sort, filter };
  next();
};