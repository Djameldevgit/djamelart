import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../redux/actions/orderAction';

const Order = () => {
  const dispatch = useDispatch();
  const { auth, orders: orderState } = useSelector(state => state);
  const orderList = orderState.orders;
console.log(orderList)
  useEffect(() => {
    if (auth.token) {
      dispatch(getOrders(auth.token));
    }
  }, [auth.token, dispatch]);

  return (
    <div className="order-page">
      <h2>Mis Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orderList) && orderList.length > 0 ? (
            orderList.map(order => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    {order.items?.map(item => (
                      <li key={item._id}>
                        {item.title} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.status || 'Pendiente'}</td>
                <td>${order.totalPrice?.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay pedidos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Order;

