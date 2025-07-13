export const formatResponse = (items, total, range, resourceName) => {
  const [start] = range;
  const data = items.map(item => ({
    id: item._id.toString(),
    ...item.toObject()
  }));

  return {
    data,
    headers: {
      'Content-Range': `${resourceName} ${start}-${start + items.length - 1}/${total}`,
      'Access-Control-Expose-Headers': 'Content-Range'
    }
  };
};