import { analyticsLogSchema } from '../models/AnalyticsLogModel.js';
import { analyticsConnection } from '../config/database.js';

export const getAnalyticsCollections = async (req, res) => {
  try {
    const db = req.app.get('analyticsDB');
    if (!db) {
      return res.status(500).json({ error: 'Analytics DB connection not ready' });
    }

    const collections = await db.listCollections().toArray();

    // Фильтр по формату YYYY_M_MONTH
    const regex = /^\d{4}_\d{1,2}_[A-Z]+$/;

    const filtered = collections
      .map(c => c.name)
      .filter(name => regex.test(name));

    res.json({ collections: filtered });
  } catch (error) {
    console.error('Error fetching analytics collections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAnalyticsDayRange = async (req, res) => {
  try {
    const { collectionName, userId } = req.query;

    if (!collectionName || !userId) {
      return res.status(400).json({ error: 'Missing collectionName or userId' });
    }

    // Получаем модель динамически
    const AnalyticsModel = analyticsConnection.model(collectionName, analyticsLogSchema, collectionName);

    const doc = await AnalyticsModel.findOne({ ID: userId }).lean();

    if (!doc || !Array.isArray(doc.INFO) || doc.INFO.length === 0) {
      return res.json({"minDay":0,"maxDay":0});
    }

    const days = doc.INFO.map(entry => entry.DAY);
    const minDay = Math.min(...days);
    const maxDay = Math.max(...days);

    res.json({ minDay, maxDay });
  } catch (error) {
    console.error('Error fetching day range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAnalyticsLogsByDayRange = async (req, res) => {
  try {
    const { collectionName, userId, minDay, maxDay } = req.query;

    if (!collectionName || !userId || !minDay || !maxDay) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const AnalyticsModel = analyticsConnection.model(collectionName, analyticsLogSchema, collectionName);
    const doc = await AnalyticsModel.findOne({ ID: userId }).lean();

    if (!doc || !Array.isArray(doc.INFO)) {
      return res.status(404).json({ error: 'No data found for user in this collection' });
    }

    // Фильтруем по диапазону дней
    const filteredInfo = doc.INFO.filter(entry =>
      entry.DAY >= parseInt(minDay) && entry.DAY <= parseInt(maxDay)
    );

    res.json({ logs: filteredInfo });
  } catch (error) {
    console.error('Error fetching logs by day range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
