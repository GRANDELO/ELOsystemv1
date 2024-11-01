const Queue = require('bull');

const paymentQueue = new Queue('payment queue', {
    redis: {
        host: 'https://elosystemv1.onrender.com', // Change if your Redis server is hosted elsewhere
        port: 6379
    }
});

module.exports = paymentQueue;
