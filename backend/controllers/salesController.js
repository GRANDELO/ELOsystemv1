const Sale = require('../models/Sale');

exports.getTotalSales = async (req, res) => {
    try {
        const totalSales = await Sale.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        res.json({ total: totalSales[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total sales', error });
    }
};

exports.getMonthlySales = async (req, res) => {
    try {
        const monthlySales = await Sale.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id': 1 }
            },
            {
                $project: {
                    month: '$_id',
                    total: 1,
                    _id: 0
                }
            }
        ]);
        res.json(monthlySales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching monthly sales', error });
    }
};

exports.getRecentSales = async (req, res) => {
    try {
        const recentSales = await Sale.find().sort({ createdAt: -1 }).limit(10);
        res.json(recentSales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent sales', error });
    }
};
