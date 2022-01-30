import React, { Fragment,useEffect } from 'react';
import { CgMouse } from 'react-icons/all';
import "./Home.css"
import Product from "./ProductCard.jsx";
import {getProduct,clearErrors} from "../../actions/productAction";
import {useSelector,useDispatch} from "react-redux";
import Loader from '../Loader/Loader';
import {useAlert} from "react-alert"
import {Link} from "react-router-dom";

const Home = () => {
    const alert = useAlert()
    const dispatch = useDispatch();

    const {loading,error,products}=useSelector((state)=>state.products)
    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    },[dispatch,error,alert])
    return (
        <Fragment>
            {loading? <Loader></Loader> :
            <Fragment>
            <div className="banner">
                    <h1>Get upto 70% off on Laptops | Epic Deals on Top Brands</h1>
                    <Link to="/products">
                Shop Now
                        <CgMouse style={{  transform:"translateY(.2vmax)"}} ></CgMouse>
                  
                    </Link>
            </div>
            <h2 className="homeHeading">Featured Products</h2>
            <div className="container" id="Featured Products">
            { products && products.map((product,i) =>(
                         <Product key={i} product={product}/>
    )) }
            </div>
        </Fragment>
            }
        </Fragment>
    );
}

export default Home;
