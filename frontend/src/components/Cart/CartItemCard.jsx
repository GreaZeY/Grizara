import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div title={item.name} className="CartItemCard">
      <div >
      <Link to={`/product/${item.product}/${item.name}`}><img src={item.image} alt={item.name}/></Link>
      </div>
      <div className="cart-item-info">
      <Link to={`/product/${item.product}/${item.name}`}>{item.name.length>70? item.name.slice(0,70)+'...':item.name}</Link>
      <b className={item.stock<1?"redColor":"greenColor"}
                style={{fontSize:'.7vmax',marginTop:'.4vmax'}} >
                    {item.stock<1?"Out of Stock":"In Stock"}
                </b>
        <span>{`Price: ₹${item.price}`}</span>
               
        <p onClick={() => deleteCartItems(item.product)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;