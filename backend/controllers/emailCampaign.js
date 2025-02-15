const Subscriber = require('../models/email')

exports.footerSubscribe =  async( res, req) => {

    const{ email } = req.body;

    if (!email) {
        return res.status(400).json({ message : "Email required"})
    }
    try {
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
          return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newEmail = new Subscriber({email});
        await newEmail.save();
        res.statusstatus(201).json({ message: 'Subscription successful' });
    } catch(error){
        if (error.code ===11000){
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        res.status(500).json({ message: 'Server error' });
    }

};

