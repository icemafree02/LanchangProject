import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../menu_detail.css';
import { addItemToCart } from '../slice/cartslice';

const NoodleDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedNoodle = useSelector(state => state.noodle.selectedItem);
  const [quantity, setQuantity] = useState(1);
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(prevQuantity + amount, 1)); // Prevent quantity from going below 1
  };

  const handleHomeDeliveryChange = () => {
    setHomeDelivery(prev => !prev);
  };

  const handleAddToCart = () => {
    if (selectedNoodle) {
      dispatch(addItemToCart({
        id: selectedNoodle.Noodle_menu_id,
        name: selectedNoodle.Noodle_menu_name,
        price: selectedNoodle.Noodle_menu_price,
        quantity,
        type: 'noodle',
        quantity,
        homeDelivery,
        additionalInfo,
      }));
      console.log(`Added ${quantity} of ${selectedNoodle.Noodle_menu_name} to cart.`);
      navigate('/menu_order');  // Redirect to menu_order.jsx after adding to cart
    }
  };

  useEffect(() => {
    // If no noodle is selected, redirect back to the menu order page
    if (!selectedNoodle) {
      navigate('/menu_order');
    }
  }, [selectedNoodle, navigate]);

  return (
    <div>
      <header className="header"></header>

      <div className="picture">
        <div id="noodle-detail-container">
          {selectedNoodle ? (
            <div>
              <img
                className="picture-detail"
                src={`http://localhost:5000/api/noodleimage/${selectedNoodle.Noodle_menu_id}`}
                alt={selectedNoodle.Noodle_menu_name}
              />
              <h2 className="title">{selectedNoodle.Noodle_menu_name}</h2>
              <p className="price">{selectedNoodle.Noodle_menu_price} บาท</p>
            </div>
          ) : (
            <p>No noodle selected. Please go back and choose a noodle.</p>
          )}
        </div>
      </div>

      <div className="takehome">
        <input
          type="checkbox"
          id="homeDelivery"
          className="checker"
          checked={homeDelivery}
          onChange={handleHomeDeliveryChange}
        />
        <label htmlFor="homeDelivery" className="takehome">สั่งกลับบ้าน</label>
      </div>

      <div className="additional">
        <textarea
          rows="7"
          cols="55"
          placeholder="รายละเอียดเพิ่มเติม เช่น ไม่ใส่ผัก เผ็ดมาก"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        ></textarea>
      </div>

      <div className='addspace'></div>

      <footer>
        <div className="left">
          <div className="counter">
            <button
              id="decrease"
              className="decrement"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span id="quantity" className="value">{quantity}</span>
            <button
              id="increase"
              className="increment"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
          <button
            id="additem"
            className="btn btn-outline-success"
            onClick={handleAddToCart}
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </footer>
    </div>
  );
};

export default NoodleDetail;
