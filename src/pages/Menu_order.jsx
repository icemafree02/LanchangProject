import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../menu_order.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import lanchan from '../image/lanchan.png';
import cart from '../image/cart.jpg';
import { fetchMenuData, fetchMenuItemDetail } from '../slice/menuslice';
import { fetchNoodleData, setSelectedNoodle } from '../slice/noodleslice';

const MenuOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedTable = useSelector(state => state.table.selectedTable);
  const menuItems = useSelector(state => state.menu.items);
  const noodleItems = useSelector(state => state.noodle.items);
  const cartItems = useSelector(state => state.cart.items);
  const location = useLocation();
  const { orderId } = location.state || {};
  const [isNoodleCustomization, setIsNoodleCustomization] = useState(false);
  const [noodleOptions, setNoodleOptions] = useState({
    soupType: '',
    noodleType: '',
    meatType: '',
    size: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState({ noodles: [], menus: [] });
  const [activeCategory, setActiveCategory] = useState('all');


  const fetchInitialMenu = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menu');
      const data = await response.json();
      const menuItems = data.filter(item => item.Menu_category !== "ก๋วยเตี๋ยว");
      setFilteredItems({ noodles: [], menus: menuItems });
      setActiveCategory('menu');
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };
  
  useEffect(() => {
    fetchInitialMenu();
  }, []);

  useEffect(() => {
    dispatch(fetchMenuData());
    dispatch(fetchNoodleData());
  }, [dispatch]);

  const handleMenuItemClick = (item) => {
    if (item.Menu_id) {
      dispatch(fetchMenuItemDetail(item.Menu_id))
        .then(() => navigate('/menu_order/menu_detail'));
    }
  };

  const handleNoodleClick = () => {
    setIsNoodleCustomization(!isNoodleCustomization);
    setActiveCategory('noodle');
  };

  const handleNoodleOptionChange = (option, value) => {
    setNoodleOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleCartClick = () => {
    navigate('/menu_order/cart');
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const filtered = {
      noodles: noodleItems.filter(item =>
        item.Noodle_menu_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      menus: menuItems.filter(item =>
        item.Menu_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
    setFilteredItems(filtered);
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
    setIsNoodleCustomization(category === 'noodle');
    if (category !== 'noodle') {
      const fetchCategoryItems = async () => {
        try {
          let response;
          switch (category) {
            case 'beverage':
              response = await fetch('http://localhost:5000/api/menu');
              break;
            case 'appetizer':
              response = await fetch('http://localhost:5000/api/menu');
              break;
            case 'other':
              response = await fetch('http://localhost:5000/api/menu');
              break;
            default:
              setFilteredItems({ noodles: [], menus: [] });
              return;
          }

          const data = await response.json();
          if (category === 'beverage') {
            const beverageItems = data.filter(item => item.Menu_category === "เครื่องดื่ม");
            setFilteredItems({ noodles: [], menus: beverageItems });
          } else if (category === 'appetizer') {
            const appetizerItems = data.filter(item => item.Menu_category === "เครื่องเคียง");
            setFilteredItems({ noodles: [], menus: appetizerItems });
          } else if (category === 'other') {
            const otherItems = data.filter(item => item.Menu_category === "เมนูอื่น");
            setFilteredItems({ noodles: [], menus: otherItems });
          }
        } catch (error) {
          console.error('Error fetching category items:', error);
          setFilteredItems({ noodles: [], menus: [] });
        }
      };

      fetchCategoryItems();
    }
  };

  const handleAllMenuClick = async () => {
    try {
      setIsNoodleCustomization(false);
      setActiveCategory('all');
      
      const response = await fetch('http://localhost:5000/api/menu');
      const data = await response.json();
      setFilteredItems({ noodles: [], menus: data });
      
    } catch (error) {
      console.error('Error fetching all menu items:', error);
    }
  };

  const renderNoodleCustomization = () => (
    <div className='noodlesearch'>
      <div className="noodle-customization">
          <div className='noodletype'>
            <div>เส้น</div>
            {['เส้นเล็ก', 'เส้นใหญ่', 'หมี่ขาว', 'วุ้นเส้น', 'หมี่เหลือง', 'หมี่หยก', 'มาม่า', 'เกาเหลา'].map((type) => (
              <label className='name' key={type}>
                <input
                  className='label'
                  type="radio"
                  name="noodleType"
                  value={type}
                  checked={noodleOptions.noodleType === type}
                  onChange={(e) => handleNoodleOptionChange('noodleType', e.target.value)}
                />
                {type}
              </label>
            ))}
          </div>
        <div className='souptype'>
          <div>น้ำซุป</div>
          {['น้ำตก', 'น้ำใส', 'แห้ง'].map((type) => (
            <label className='name' key={type}>
              <input
                className='label'
                type="radio"
                name="soupType"
                value={type}
                checked={noodleOptions.soupType === type}
                onChange={(e) => handleNoodleOptionChange('soupType', e.target.value)}
              />
              {type}
            </label>
          ))}
        </div>
        <div className='meat'>
          <div>เนื้อ</div>
          {['หมู', 'เนื้อสด', 'เนื้อเปื่อย'].map((type) => (
            <label className='name' key={type}>
              <input
                className='label'
                type="radio"
                name="meatType"
                value={type}
                checked={noodleOptions.meatType === type}
                onChange={(e) => handleNoodleOptionChange('meatType', e.target.value)}
              />
              {type}
            </label>
          ))}
        </div>
        <div className='size'>
          <div>ขนาด</div>
          {['ธรรมดา', 'พิเศษ', 'จัมโบ้'].map((type) => (
            <label className='name' key={type}>
              <input
                className='label'
                type="radio"
                name="size"
                value={type}
                checked={noodleOptions.size === type}
                onChange={(e) => handleNoodleOptionChange('size', e.target.value)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
      <button className="btn btn-outline-success" id='noodlesearchbtn' onClick={handleNoodleSearch}>กดเพื่อค้นหา</button>
    </div>
  );

  const handleNoodleSearch = async () => {
    const { noodleType, soupType, meatType, size } = noodleOptions;
    if (!soupType || !noodleType || !meatType || !size) {
      alert('กรุณาเลือกตัวเลือกให้ครบทุกช่อง');
      return;
    }

    const searchTerms = [noodleType,soupType, meatType, size];
    const keyword = searchTerms.join('%') + '%';

    try {
      const response = await fetch('http://localhost:5000/api/noodle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.length > 0) {
        const selectedNoodle = data[0];
        await dispatch(setSelectedNoodle(selectedNoodle));
        navigate('/menu_order/noodle_detail');
      } else {
        alert('ไม่พบเมนูที่เลือก');
      }
    } catch (error) {
      console.error('Error searching for noodles:', error);
    }
  };
  return (
    <div>
      <div className="headbar">
        <div className="picturelogo">
          <img src={lanchan} alt="ร้านก๋วยเตี๋ยวเรือล้านช้าง" />
        </div>
        <div id="tableInfo">
          {selectedTable ? `โต๊ะของคุณ : ${selectedTable}` : 'ไม่มีโต๊ะที่เลือก'}
        </div>
        <form className="d-flex" role="search" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="ค้นหาเมนู"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-success" id="search">ค้นหา</button>
        </form>
        <div className="menubutton">
          <button
            type="button"
            id='noodlebtn'
            className={`btn btn-outline-success ${activeCategory === 'noodle' ? 'active' : ''}`}
            onClick={handleNoodleClick}
          >
            ก๋วยเตี๋ยว
          </button>
          <button
            type="button"
            id='allmenubtn'
            className={`btn btn-outline-success ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={handleAllMenuClick}
          >
            เมนูทั้งหมด
          </button>
          <button
            type="button"
            id='beveragebtn'
            className={`btn btn-outline-success ${activeCategory === 'beverage' ? 'active' : ''}`}
            onClick={() => filterByCategory('beverage')}
          >
            เครื่องดื่ม
          </button>
          <button
            type="button"
            id='appetizerbtn'
            className={`btn btn-outline-success ${activeCategory === 'appetizer' ? 'active' : ''}`}
            onClick={() => filterByCategory('appetizer')}
          >
            เครื่องเคียง
          </button>
          <button
            type="button"
            id='othermenubtn'
            className={`btn btn-outline-success ${activeCategory === 'other' ? 'active' : ''}`}
            onClick={() => filterByCategory('other')}
          >
            เมนูอื่นๆ
          </button>
        </div>
      </div>

      <div id="menu-container">
        {isNoodleCustomization ? renderNoodleCustomization() : (
          filteredItems.menus.map(item => (
            <div key={item.Menu_id} className="menu-item" onClick={() => handleMenuItemClick(item)}>
              <img className="menu-picture" src={`http://localhost:5000/api/menuimage/${item.Menu_id}`} alt={item.Menu_name} />
              <div className="menu-name">{item.Menu_name}</div>
              <div className="menu-price">{item.Menu_price} บาท</div>
            </div>
          ))
        )}
      </div>
      <div>
        <div className="cart" onClick={handleCartClick}>
          <img src={cart} id="cartpic" alt="Cart" />
        </div>
        <div className="numberorder">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default MenuOrder;
