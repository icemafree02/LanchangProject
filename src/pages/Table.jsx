import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedTable } from '../slice/tableslice'; 
import { setOrderId } from '../slice/cartslice'; 
import { useTableSelection } from '../Functions/tableselection';
import '../table.css';
import lanchan from '../image/lanchan.png';

function TableSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tables, loading, error } = useTableSelection();  

  const reserveTable = async (tableNumber) => { 
    try {
      // Reserve the table
      const reserveResponse = await fetch(`http://localhost:5000/api/table/${tableNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tables_status: 'Reserved' }),
      });
  
      if (!reserveResponse.ok) {
        throw new Error('Failed to reserve table');
      }
  
      // Create a new order
      const createOrderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableId: tableNumber }),
      });
  
      if (!createOrderResponse.ok) {
        throw new Error('Failed to create new order');
      }
  
      const { orderId } = await createOrderResponse.json();
  
      // Dispatch selected table and orderId
      dispatch(setSelectedTable(tableNumber));
      dispatch(setOrderId(orderId)); // Add this line to store orderId in Redux
      navigate('/menu_order');
    } catch (error) {
      console.error('Error reserving table or creating order:', error);
      alert('Failed to reserve table or create order. Please try again.');
    }
  };
  
  const handleTableSelection = (tableNumber) => {
    reserveTable(tableNumber);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className='header'>
        <div className="picturelogo">
          <img src={lanchan} alt="ร้านก๋วยเตี๋ยวเรือล้านช้าง" />
        </div>
        <div className="title0">ยินดีต้อนรับ</div>
        <div className="title1">ร้านก๋วยเตี๋ยวเรือล้านช้าง</div>
      </div>
      <div className="title2">กรุณาเลือกโต๊ะที่ท่านนั่ง</div>
      <div className="row">
        <div id="table-container">
          {tables.map((table) => {
            const { tables_number, tables_status } = table;
            const isReserved = tables_status === 'Reserved';  
            const isAvailable = tables_status === 'Available'; 
            return (
              <button
                key={tables_number}
                className={`box ${isReserved ? 'Reserved' : ''}`}
                onClick={() => isAvailable && handleTableSelection(tables_number)}
                disabled={isReserved || loading}  // Disable if reserved or loading
                aria-label={isReserved ? `Table ${tables_number} is reserved` : `Select Table ${tables_number}`} // Accessibility
              >
                <div>{tables_number}</div>
                {isReserved && <div className="reserved-text">-จองแล้ว</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TableSelection;
