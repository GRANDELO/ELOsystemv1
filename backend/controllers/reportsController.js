const Sale = require('../models/Sale');
const User = require('../models/User');

exports.generateReport = async (req, res) => {
    const { reportType } = req.query;

    try {
        let reportData;
        switch (reportType) {
            case 'summary':
                const totalUsers = await User.countDocuments();
                const activeUsers = await User.countDocuments({ active: true });
                const totalSales = await Sale.aggregate([
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ]);
                reportData = {
                    totalUsers,
                    activeUsers,
                    totalSales: totalSales[0]?.total || 0
                };
                break;
            case 'detailed':
                reportData = await Sale.find().populate('user', 'username').exec();
                break;
            case 'sales':
                reportData = await Sale.find().exec();
                break;
            case 'user':
                reportData = await User.find().exec();
                break;
            default:
                return res.status(400).json({ message: 'Invalid report type' });
        }

        res.json(reportData);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error });
    }
};
