import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../menu_ordered.css';

const MenuOrdered = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const orderId = useSelector(state => state.cart.orderId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch order details: ${response.status}`);
          }
          const data = await response.json();
          setOrderDetails(data);
        } catch (error) {
          console.error('Error fetching order details:', error);
          alert(`Error: ${error.message}`);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const BacktoMenu = () => {
    navigate('/menu_order');
  };

  const getTotalPrice = () => {
    return orderDetails.reduce((total, item) => total + item.Order_detail_price * item.Order_detail_quantity, 0);
  };

  const callStaff = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/callstaff`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      alert('ทำการเรียกพนักงานมาชำระเงินเรียบร้อย');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="menu-ordered-container">
      <header>
        <h1 className="ordered-title">รายการที่สั่ง</h1>
      </header>
      {orderId && (
        <div className="order-id">
          <h2>เลขออเดอร์ของคุณ: {orderId}</h2>
        </div>
      )}
      <div className="ordered-items-list">
        {orderDetails.length === 0 ? (
          <p className="no-order-message">ยังไม่มีรายการที่สั่ง</p>
        ) : (
          <div>
            {orderDetails.map(item => (
              <div key={item.Order_detail_id} className="ordered-item">
                <img
                  src={`http://localhost:5000/api/${item.Menu_id ? 'menuimage' : 'noodleimage'}/${item.Menu_id || item.Noodle_menu_id}`}
                  alt={item.name}
                  className="ordered-item-image"
                />
                <div className="ordered-item-details">
                  <div className="ordered-item-name">{item.name}</div>
                  <p>จำนวน: {item.Order_detail_quantity}</p>
                  <p>ราคา: {item.Order_detail_price} บาท</p>
                  <p>สถานะ: {item.Order_detail_status}</p>
                  {item.Order_detail_takehome === 1 && <p className='takehomenote'>สั่งกลับบ้าน</p>}
                  {item.Order_detail_additional && <p className='ordered-additional-note'>เพิ่มเติม: {item.Order_detail_additional}</p>}
                </div>
              </div>
            ))}
            <div className="total-price">
              <h3>ราคารวม: {getTotalPrice()} บาท</h3>
            </div>
            <div className='menu-ordered-actions'>
              <button onClick={BacktoMenu} className="back-to-menu-btn">กลับไปสั่งอาหารเพิ่ม</button>
              <button onClick={callStaff} className="callstaff">เรียกพนักงานมาชำระเงิน</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuOrdered;