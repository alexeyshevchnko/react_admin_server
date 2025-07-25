import { UserTrolley,UserTrolleyMarketOffer ,  User} from '../models/index.js';

export const getUserTrolleys = async (req, res) => {
  try {
    const { userId } = req.params;
    const trolleys = await UserTrolley.find({ user_id: userId/*, deleted: false*/ });
    res.json(trolleys);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении тележек пользователя' });
  }
};

export const getUserTrolleyById = async (req, res) => {
  try {
    const trolley = await UserTrolley.findById(req.params.id);
    if (!trolley || trolley.deleted) {
      return res.status(404).json({ error: 'Тележка не найдена' });
    }
    res.json(trolley);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении тележки' });
  }
};

export const getUserTrolleysGrouped = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await UserTrolley.aggregate([
        { $match: {
            user_id: userId,
            $or: [
              { deleted: false },
              { deleted: { $exists: false } }
            ]
          }
        },
        { $group: { _id: "$trolley_id", count: { $sum: 1 } } },
      ]); 

    const trolleyNames = {
      '1': 'common',
      '2': 'unique',
      '3': 'legendary',
      '4': 'secret',
      '5': 'runic',
    };

    const mapped = result.map(item => ({
      id: item._id,
      name: trolleyNames[item._id] || 'unknown',
      count: item.count
    }));

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении сгруппированных тележек' });
  }
};


export const getTrolleysByTypeAndUser = async (req, res) => {
  try {
    const { userId, typeId } = req.query;
    
    if (!userId || !typeId) {
      return res.status(400).json({ error: 'Требуется userId и typeId' });
    }
 
    const trolleys = await UserTrolley.find({
      user_id: userId,
      trolley_id: typeId,
      $or: [
        { deleted: false },
        { deleted: { $exists: false } }
      ]
    }).select('-_id');
 
    if (!trolleys.length) {
      return res.status(404).json({ message: 'Тележки не найдены' });
    }

    res.json(trolleys);
  } catch (err) {
    console.error('Ошибка в getTrolleysByTypeAndUser:', err);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: err.message
    });
  }
};

const trolleyNames = {
  '1': 'common',
  '2': 'unique',
  '3': 'legendary',
  '4': 'secret',
  '5': 'runic',
};

const mapUserTrolleys = (items, userTrolleyMap) =>
  items.map(item => {
    const trolleyId = item.user_trolley_id?.toString();
    const trolleyData = trolleyId ? userTrolleyMap[trolleyId] : null;

    return {
      ...item,
      user_trolley: trolleyData
        ? {
            ...trolleyData,
            name: trolleyNames[trolleyData.trolley_id?.toString()] || 'unknown',
          }
        : null,
    };
  });

export const getBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const {
      page = 1,
      limit = 10,
      _sort = 'created_at',
      _order = 'DESC'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [_sort]: _order === 'DESC' ? -1 : 1 };

    const [purchases, total] = await Promise.all([
      UserTrolleyMarketOffer.find({ buyer_user_id: buyerId })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      UserTrolleyMarketOffer.countDocuments({ buyer_user_id: buyerId })
    ]);

    const salesmanIds = [...new Set(purchases.map(p => p.salesman_user_id).filter(Boolean))];
    const salesmen = await User.find({ ID: { $in: salesmanIds } }).select('_id ID').lean();
    const salesmanMap = Object.fromEntries(salesmen.map(s => [s.ID, s]));

    const userTrolleyIds = [...new Set(purchases.map(p => p.user_trolley_id).filter(Boolean).map(id => id.toString()))];
    const userTrolleys = await UserTrolley.find({ _id: { $in: userTrolleyIds } }).lean();
    const userTrolleyMap = Object.fromEntries(userTrolleys.map(ut => [ut._id.toString(), ut]));

    const enrichedPurchases = mapUserTrolleys(purchases, userTrolleyMap).map(p => ({
      ...p,
      salesman_user: salesmanMap[p.salesman_user_id] || null,
    }));

    res.json({ data: enrichedPurchases, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSalesman = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const {
      page = 1,
      limit = 10,
      _sort = 'created_at',
      _order = 'DESC'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [_sort]: _order === 'DESC' ? -1 : 1 };

    const [offers, total] = await Promise.all([
      UserTrolleyMarketOffer.find({ salesman_user_id: salesmanId })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      UserTrolleyMarketOffer.countDocuments({ salesman_user_id: salesmanId })
    ]);

    const buyerIds = [...new Set(offers.map(o => o.buyer_user_id).filter(Boolean))];
    const buyers = await User.find({ ID: { $in: buyerIds } }).select('_id ID').lean();
    const buyerMap = Object.fromEntries(buyers.map(b => [b.ID, b]));

    const userTrolleyIds = [...new Set(offers.map(o => o.user_trolley_id).filter(Boolean).map(id => id.toString()))];
    const userTrolleys = await UserTrolley.find({ _id: { $in: userTrolleyIds } }).lean();
    const userTrolleyMap = Object.fromEntries(userTrolleys.map(ut => [ut._id.toString(), ut]));

    const enrichedOffers = mapUserTrolleys(offers, userTrolleyMap).map(o => ({
      ...o,
      buyer_user: buyerMap[o.buyer_user_id] || null,
    }));

    res.json({ data: enrichedOffers, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
