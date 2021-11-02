import React, { Fragment,useEffect } from 'react';
import { CgMouse } from 'react-icons/all';
import "./Home.css"
import Product from "./Product.jsx";
import {getProduct} from "../../actions/productAction";
import {useSelector,useDispatch} from "react-redux";
import Loader from '../Loader/Loader';
import {useAlert} from "react-alert"


const Home = () => {
    const alert = useAlert()
    const dispatch = useDispatch();

    const {loading,error,productsCount,products}=useSelector((state)=>state.products)
    useEffect(()=>{
        if(error){
            return alert.error(error)
        }
        dispatch(getProduct());
    },[dispatch,error,alert])
    return (
        <Fragment>
            {loading? <Loader></Loader> :
            <Fragment>
            <div className="banner">
                    <h1>Get upto 70% off | Epic Festive Deals</h1>
                    <a href="#container">
                    <button>Shop Now
                        <CgMouse style={{  transform:"translateY(.2vmax)"}} ></CgMouse>
                    </button>
                    </a>
            </div>
            <h2 className="homeHeading">Featured Products</h2>
            <div className="container" id="container">
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
