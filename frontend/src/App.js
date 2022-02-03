import React from "react";
import "./App.css"
import { BrowserRouter as Router,Route } from "react-router-dom";
import Header from "./components/layout/Header/Header.jsx"
import Footer from "./components/layout/Footer/Footer.jsx"
import WebFont from "webfontloader"
import Home from "./components/Home/Home.jsx"
import ProductDetals from "./components/Product/ProductDetals.jsx";
import Products from "./components/Product/Products.jsx"
import Search from "./components/Product/Search.jsx"
import Contact from "./components/layout/Contact/Contact";
import About from "./components/layout/About/About";
import LoginAndSignUp from "./components/User/LoginAndSignup";
import store from "./store"
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layout/Header/UserOptions.jsx"
import {useSelector} from "react-redux"
import Profile from "./components/User/Profile.jsx";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import ResetPassword from "./components/User/ResetPassword.jsx";
import Cart from "./components/Cart/Cart.jsx";
import Checkout from "./components/Cart/Checkout.jsx";

function App() {
  const {isAuthenticated,user} = useSelector(state => state.user)
  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans"]
      }
    })   
    store.dispatch(loadUser())
  }, [])
  return (
    <Router>
   <Header/>
   
   {isAuthenticated && <UserOptions user={user}/>}
   <Route exact path = "/" component={Home}/>
   <Route exact path="/about" component={About} />
   <Route exact path="/contact" component={Contact} />
   <Route exact path = "/products" component={Products}/>
   <Route exact path = "/products/:keyword" component={Products}/>
   <Route exact path = "/search" component={Search}/>
   <Route exact path = "/login" component={LoginAndSignUp}/>
   <ProtectedRoute exact path = "/account" component={Profile}/>
   <Route exact path = "/password/reset/:token" component={ResetPassword}/>
   <Route exact path = "/cart" component={Cart}/>
   <ProtectedRoute exact path = "/checkout" component={Checkout}/>
  
   <Route path = "/product/:id/:name" component={ProductDetals}/>
   <Footer/>
   </Router>
  );
}

export default App;
