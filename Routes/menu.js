const express = require('express')
const router = express.Router()

const { read,readID, order,orderID, callstaff,addItemsToOrder, updateOrder } = require('../Controllers/menu')
const { getImage } = require('../Controllers/menu_image');

router.get('/menu', read);
router.get('/menu/:id', readID);
router.get('/menuimage/:id', getImage);

router.get('/orders/:orderId',orderID)
router.post('/orders',order)
router.put('/orders/:orderId',updateOrder)
router.put('/orders/:orderId/callstaff',callstaff)
router.put('/orders/:orderId/add_items', addItemsToOrder);





module.exports = router
