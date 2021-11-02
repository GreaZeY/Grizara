import React from 'react';
import {ReactNavbar} from "overlay-navbar"
import logo from "../../../images/logo.png"

// Navbar options
const options = {
    burgerColorHover: "tomato",
    burgerColor:"#FF007A",
    logo,
    logoWidth: "10vmax",
    navColor1: "#000000e5",
    logoHoverSize: "10px",
    logoHoverColor: "transparent",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "About",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/contact",
    link4Url: "/about",
    link1Size: "1.3vmax",
    link1Color: "white",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#FF007A",
    link1Margin: "1vmax",
    profileIconUrl: "/login",
    profileIconColor: "white",
    searchIconColor: "white",
    cartIconColor: "white",
    profileIconColorHover: "#FF007A",
    searchIconColorHover: "#FF007A",
    cartIconColorHover: "#FF007A",
    cartIconMargin: "1vmax",
  };

const Header = () => {
    return (
      <ReactNavbar {...options}/>
    );
};


export default Header;
