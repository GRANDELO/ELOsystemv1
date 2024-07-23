const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getTotalUsers = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total users', error });
    }
};

exports.getActiveUsers = async (req, res) => {
    try {
        const activeUsers = await User.countDocuments({ active: true });
        res.json({ count: activeUsers });
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
