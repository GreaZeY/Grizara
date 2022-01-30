import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";
import logo from "../../../images/logo.png"
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <div className="appContainer">
        <img draggable="false"  src={playStore} alt="playstore" />
        <img draggable="false"  src={appStore} alt="Appstore" />
        </div>

      </div>

      <div className="midFooter"> 
      
      <img id="logo" draggable="false" src={logo} alt="grizara-logo"/>
        
        <p>Pure Quality, Pure Satisfaction</p>
        <p>Copyrights 2021 &copy; Grizara</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <div>
        <a href="http://instagram.com/" target="blank"> 
        <AiFillFacebook size="2.2vmax"></AiFillFacebook> 
        </a>
        <a href="http://facebook.com/" target="blank">
        <AiFillInstagram size="2.2vmax"></AiFillInstagram>
        </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
