import React from "react";
import "./App.css"
import { BrowserRouter as Router,Route } from "react-router-dom";
import Header from "./components/layout/Header/Header.jsx"
import Footer from "./components/layout/Footer/Footer.jsx"
import WebFont from "webfontloader"
import Home from "./components/Home/Home.jsx"
import ProductDetals from "./components/Product/ProductDetals.jsx";

function App() {
  React.useEffect(() => {
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans"]
      }
    })
  }, [])
  return (
    <Router>
   <Header/>
   <Route exact path = "/" component={Home}/>
   <Route exact path = "/product/:id/:name" component={ProductDetals}/>
   <Footer/>
   </Router>
  );
}

export default App;
