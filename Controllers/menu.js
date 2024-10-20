const db = require("../src/Functions/db");

exports.read = async (req, res) => {
  try {
    db.query('SELECT * FROM `menu` ', (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).send('Database query error');
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
};

exports.getOrder = async (req, res) => {
  try {
    db.query('SELECT * FROM `order` ', (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).send('Database query error');
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
};

exports.readID = async (req, res) => {
  const id = req.params.id;
  const query = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };
  try {
    const results = await query('SELECT * FROM menu WHERE menu_id = ?', [id]);

    if (results.length === 0) {
      return res.status(404).send('No data found');
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
};

exports.order = (req, res) => {
  const { tableId, cartItems, orderId } = req.body;

  if (orderId) {
    this.updateOrder(req, res);
  } else {
    const createOrderQuery = 'INSERT INTO `Order` (tables_id, Order_datetime, Order_status) VALUES (?, NOW(), ?)';
    const createOrderValues = [tableId, 'กำลังจัดเตรียม'];

    db.query(createOrderQuery, createOrderValues, (err, newOrderResult) => {
      if (err) {
        console.error('Error creating new order:', err);
        return res.status(500).send('Server error creating new order');
      }
      
      const newOrderId = newOrderResult.insertId;
      
      if (cartItems && cartItems.length > 0) {
        this.addItemsToOrder(newOrderId, cartItems, res);
      } else {
        res.json({ orderId: newOrderId });
      }
    });
  }
};

exports.updateOrder = (req, res) => {
  const { orderId, cartItems } = req.body;

  if (cartItems && cartItems.length > 0) {
    this.addItemsToOrder(orderId, cartItems, res);
  } else {
    res.json({ message: 'No items to add to the order' });
  }
};

exports.addItemsToOrder = (req, res) => {
  const { orderId } = req.params;
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'No items to add to the order' });
  }

  const insertQuery = `
    INSERT INTO Order_detail 
    (Order_detail_quantity, Order_detail_price, Order_detail_takehome, 
    Order_detail_additional, Order_detail_status, Order_id, Menu_id, Noodle_menu_id, Promotion_Menu_Item_id) 
    VALUES ?
  `;

  const values = cartItems.map(item => [
    item.quantity,
    item.price,
    item.homeDelivery || 0, // Store the take-home value correctly
    item.additionalInfo || null, // Store additional information correctly
    'รอทำอาหาร',  // Status of the order
    orderId,
    item.type === 'menu' ? item.id : null,
    item.type === 'noodle' ? item.id : null,
    null // Assuming Promotion_Menu_Item_id is not used
  ]);

  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Error adding items to order:', err);
      return res.status(500).json({ message: 'Error adding items to order' });
    }

    res.json({ message: 'Items added to order successfully', affectedRows: result.affectedRows });
  });
};


exports.orderID = async (req, res) => {
  try {
    const { orderId } = req.params;
    db.query(
      `SELECT od.*, 
              COALESCE(m.Menu_name, nm.Noodle_menu_name) AS name,
              m.Menu_price, nm.Noodle_menu_price
       FROM Order_detail od
       LEFT JOIN Menu m ON od.Menu_id = m.Menu_id
       LEFT JOIN Noodle_menu nm ON od.Noodle_menu_id = nm.Noodle_menu_id
       WHERE od.Order_id = ?`,
      [orderId],
      (err, results) => {
        if (err) {
          console.error('Error fetching order details:', err);
          return res.status(500).send('Error fetching order details');
        }
        res.json(results);
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
};

exports.callstaff = (req, res) => {
  const orderId = req.params.orderId;

  // Wrap the table name `Order` in backticks to avoid SQL syntax issues
  const query = 'UPDATE `Order` SET Order_status = ? WHERE Order_id = ?';

  db.query(query, ['รอชำระเงิน', orderId], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated to รอชำระเงิน' });
  });
};



