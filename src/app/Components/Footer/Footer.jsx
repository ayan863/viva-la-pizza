"use client";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";

import "./footer.css";
const Footer = () => {
  return (
    <footer className="flex justify-center w-[100%] items-center">
  <div>
  <div className="nav text-white flex flex-wrap gap-2 justify-center p-3">
    <a href="#">About us</a>
    {">"}
    <a href="#">Delivery Information</a>
    {">"}
    <a href="#">Privacy Policy</a>
    {">"}
    <a href="#">Gift Certificates</a>
  </div>
  <div className="flex justify-center w-[100%] items-center">
    <div className="flex flex-wrap gap-5 justify-center w-[100%] items-center">
      <div className="images flex flex-col ">
        <div className="firstL flex gap-2">
          <img
            src="/images/scenes/gallery-5.svg"
            alt=""
            className="w-[75px] h-[75px]" 
          />
          <img
            src="/images/scenes/gallery-4.svg"
            alt=""
            className="w-[75px] h-[75px]"
          />
          <img
            src="/images/scenes/gallery-3.svg"
            alt=""
            className="w-[75px] h-[75px]"
          />
        </div>
        <div className="secondL flex gap-2">
          <img
            src="/images/scenes/gallery-2.svg"
            alt=""
            className="w-[75px] h-[75px]"
          />
          <img
            src="/images/scenes/gallery-1.svg"
            alt=""
            className="w-[75px] h-[75px]"
          />
          <img
            src="/images/scenes/gallery-6.svg"
            alt=""
            className="w-[75px] h-[75px]"
          />
        </div>
      </div>

      <div className="info text-white flex flex-col gap-3">
        <h4>STORE INFORMATION</h4>
        <div className="flex flex-col gap-2">
          <div className="loc flex gap-2">
            <FaLocationDot className="w-[25px] h-[25px]" />
            <p>Viva La Pizza</p>
          </div>
          <div className="mail flex gap-2">
            <IoIosMail className="w-[25px] h-[25px]" />
            <a href="#">demo@gmail.com</a>
          </div>
          <div className="call flex gap-2">
            <IoCall className="w-[25px] h-[25px]" />
            <a href="#">
              Call us:<span>+91 0123456789</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="copyR p-5 flex items-center justify-center text-white">
    © 2024 Viva La Pizza. Built by Ayan Ismayilzade
  </div>
  </div>
</footer>

  
  );
};

export default Footer;
