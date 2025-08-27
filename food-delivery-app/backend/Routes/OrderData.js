const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;
    await data.splice(0, 0, { Order_date: req.body.order_date });

    // if email not existing in db then create: else: InsertMany()
    let eId = await Order.findOne({ email: req.body.email });
    console.log(eId);
    if (eId === null) {
        try {
            await Order.create({
                email: req.body.email,
                order_data: data
            }).then(() => {
                res.json({ success: true });
            });
        } catch (error) {
            console.log(error.message);
            res.json({ success: false });
            console.log("Server Error", error.message);
            res.send("Server Error", error.message);
        }
    } else {
        try {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            ).then(() => {
                res.json({ success: true });
            });
        } catch (error) {
            console.log(error.message);
            res.send("Server Error", error.message);
        }
    }
});

router.post('/myOrderData', async (req, res) => {
    try {
        const userOrders = await Order.findOne({ email: req.body.email });
        if (userOrders) {
            res.json(userOrders); // 👈 sending nested array structure
        } else {
            res.json({ order_data: [] });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
