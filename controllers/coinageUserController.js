import { CoinageUser } from '../models/index.js';

export default {
  async getFullCoinageInfo(req, res) {
    try {
      const { userId } = req.params;
      const coinage = await CoinageUser.findOne({ user_id: userId });

      if (!coinage) return res.status(404).json({ error: 'CoinageUser not found' });

      const processCycle = (coinage.process_cicle || []).map((item, index) => ({
        index,
        to_currensy_type: item.to_currensy_type,
        to_currensy_amount: item.to_currensy_amount,
        sort: item.sort,
        progress_percent: item.progress_percent,
      }));

      res.json({
        id: coinage._id.toString(),
        user_id: coinage.user_id,
        level: coinage.level,
        level_speed: coinage.level_speed,
        level_storage_gems: coinage.level_storage_gems,
        level_storage_ingots: coinage.level_storage_ingots,
        coinage_id: coinage.coinage_id,
        process_speed_in_second: coinage.process_speed_in_second,
        last_time_updated_process_speeed: coinage.last_time_updated_process_speeed,
        status: coinage.status,
        created_at: coinage.created_at,
        process_cycle: processCycle
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
