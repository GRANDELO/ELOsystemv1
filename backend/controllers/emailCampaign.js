const Subscriber = require('../models/email')

exports.footerSubscribe =  async( req, res) => {

    const{ email } = req.body;

    if (!email) {
        return res.status(400).json({ message : "Email required"})
    }
    try {
        const existingSubscriber = await Subscriber({ email });
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
//OPTIONS /api/subscribe 204 0.163 ms - 0
// /opt/render/project/src/backend/controllers/emailCampaign.js:5
// const{ email } = req.body;
//        ^
// TypeError: Cannot destructure property 'email' of 'req.body' as it is undefined.
// at exports.footerSubscribe (/opt/render/project/src/backend/controllers/emailCampaign.js:5:12)
// at Layer.handle [as handle_request] (/opt/render/project/src/backend/node_modules/express/lib/router/layer.js:95:5)
// at next (/opt/render/project/src/backend/node_modules/express/lib/router/route.js:149:13)
// at Route.dispatch (/opt/render/project/src/backend/node_modules/express/lib/router/route.js:119:3)
// at Layer.handle [as handle_request] (/opt/render/project/src/backend/node_modules/express/lib/router/layer.js:95:5)
// at /opt/render/project/src/backend/node_modules/express/lib/router/index.js:284:15
// at Function.process_params (/opt/render/project/src/backend/node_modules/express/lib/router/index.js:346:12)
// at next (/opt/render/project/src/backend/node_modules/express/lib/router/index.js:280:10)
// at Function.handle (/opt/render/project/src/backend/node_modules/express/lib/router/index.js:175:3)
// at router (/opt/render/project/src/backend/node_modules/express/lib/router/index.js:47:12)


