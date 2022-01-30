import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div className="CartItemCard">
      <Link to={`/product/${item.product}/${item.name}`}><img src={item.image} alt="ssa" /></Link>
      <div>
      <Link to={`/product/${item.product}/${item.name}`}>{item.name}</Link>
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