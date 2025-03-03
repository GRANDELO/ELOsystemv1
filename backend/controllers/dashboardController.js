const User = require('../models/User');
const Buyers = require('../models/buyers');
const Activity = require('../models/Activity');

exports.getTotalUsers = async (req, res) => {
    try {
        const count = await User.countDocuments();
        const countBuyer = await Buyers.countDocuments();
        const totalCount = count + countBuyer ;
        res.json({ totalCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total users', error });
    }
};

exports.getActiveUsers = async (req, res) => {
    try {
        const activeUsers = await User.countDocuments({ active: true });
        const activeBuyers = await Buyers.countDocuments({ active: true });

        const totalActiveUsers = activeUsers + activeBuyers;

        res.json({ TotalCount: totalActiveUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active users', error });
    }
};

exports.getRecentActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent activities', error });
    }
};
