"use client";
import { productImage, onImageError } from "@/lib/images";
import { readStorage } from "@/lib/storage";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { GoDotFill } from "react-icons/go";
import "./basket.css";
import { TiDelete } from "react-icons/ti";
import toast from "react-hot-toast";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
import Link from "next/link";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
const Basket = () => {
  const data = [
    { option: "10%" },
    { option: "25%" },
    { option: "50%" },
    { option: "75%" },
    { option: "FREE!" },
    { option: "0%" },
  ];
  const router = useRouter();

  const [hasSpun, setHasSpun] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [balanceAfter, setBalanceAfter] = useState(null);

  useEffect(() => {
    const userData = readStorage("user") || { basket: [] };
    setCartItems(userData.basket || []);
  }, []);

  const getNumericPrize = (prize) => {
    if (prize.includes("FREE!")) return 100;
    if (prize.includes("%")) return parseFloat(prize.replace("%", ""));
    return 0;
};
  // Hesablama köməkçiləri: bütün məbləğlər rəqəm kimi, 2 onluq rəqəmlə
  const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
  const orderSnapshot = React.useRef(null);

  // Çarx dayananda: endirimi tətbiq et, balansı yenilə, sifarişi saxla
  const handleStopSpinning = () => {
    setMustSpin(false);
    const snapshot = orderSnapshot.current;
    if (!snapshot) return;

    const prize = data[prizeNumber].option;
    const percent = getNumericPrize(prize);
    const finalPrice = round2(snapshot.total * (1 - percent / 100));
    const user = readStorage("user") || {};
    const newBalance = round2((parseFloat(user.money) || 0) - finalPrice);

    setSelectedPrize(prize);
    setDiscountedTotal(finalPrice);
    setBalanceAfter(newBalance);
    setIsOrderPlaced(true);

    const order = {
      items: snapshot.items,
      original: round2(snapshot.total).toFixed(2),
      discount: percent,
      spent: finalPrice.toFixed(2),
      date: new Date().toISOString(),
    };
    const updatedUser = {
      ...user,
      money: newBalance.toFixed(2),
      basket: [],
      orders: [order],
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setCartItems([]);

    if (user.id) {
      axios
        .put(`https://66eba35c2b6cf2b89c5b2596.mockapi.io/login/${user.id}`, updatedUser)
        .catch((error) => console.error("Error updating user data:", error));
    }

    toast.success(
      `Sale: ${prize} — you pay ${finalPrice.toFixed(2)}₼. Balance: ${newBalance.toFixed(2)}₼`
    );
    setTimeout(() => router.push("/Pages/delivery"), 4000);
  };

  const [cartItems, setCartItems] = useState([]);
  const [selectedPrize, setSelectedPrize] = useState("");
  const handlePrizeSelection = (prize) => {
    setSelectedPrize(prize);
  };
  useEffect(() => {
    const userData = readStorage("user") || { basket: [] };
    setCartItems(userData.basket || []);
  }, []);

  const updateUserStorage = (updatedBasket) => {
    const userData = readStorage("user") || {};
    const updatedUserData = {
      ...userData,
      basket: updatedBasket,
    };
    localStorage.setItem("user", JSON.stringify(updatedUserData));

    const parsedUser = readStorage("user") || {};

    axios
      .put(
        `https://66eba35c2b6cf2b89c5b2596.mockapi.io/login/${parsedUser.id}`,
        updatedUserData
      )
      .then((response) => {
        console.log("User data successfully updated on the server:", response);
      })
      .catch((error) => {
        console.error("Error updating user data on the server:", error);
      });
  };
  // "Order" düyməsi: balansı yoxla, sonra çarxı fırlat
  const handleOrderClick = () => {
    if (cartItems.length === 0) {
      toast.error("Your basket is empty.");
      return;
    }
    const userData = readStorage("user") || { money: 0 };
    const userBalance = parseFloat(userData.money) || 0;
    if (userBalance < totalPrice) {
      toast.error("Insufficient balance! Please top up your account.");
      return;
    }
    orderSnapshot.current = { items: cartItems, total: totalPrice };
    setSelectedPrize("");
    setPrizeNumber(Math.floor(Math.random() * data.length));
    setMustSpin(true);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    updateUserStorage(updatedItems);
    toast.success("Item is removed from th basket");
  };

  const updateQuantity = (id, quantityChange) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + quantityChange;
        const validQuantity = newQuantity > 0 ? newQuantity : 1;

        let unitPrice;
        if (Array.isArray(item.price)) {
          unitPrice = item.price[0];
        } else {
          unitPrice = item.price;
        }

        if (isNaN(unitPrice)) unitPrice = 0;

        const newTotal = (validQuantity * unitPrice).toFixed(2);

        return {
          ...item,
          quantity: validQuantity,
          total: newTotal,
        };
      }
      return item;
    });

    setCartItems(updatedItems);
    updateUserStorage(updatedItems);
  };

  const totalPrice = Math.round(
    cartItems.reduce((total, item) => total + (parseFloat(item.total) || 0), 0) * 100
  ) / 100;
  const formattedTotalPrice = totalPrice.toFixed(2);
  useEffect(() => {
    const hasSpunBefore = readStorage("hasSpun") || false;
    setHasSpun(hasSpunBefore);
  }, []);

  return (
    <>
    <Header/>
      <section className="basket-section flex justify-center items-center w-[100%]">
        <div className="cart-container ">
          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={productImage(item)}
                    onError={onImageError(item.type)}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-infos">
                    <h4>{item.name}</h4>
                    <p>{item.total}₼</p>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="delete-btn"
                      >
                        <TiDelete className="w-[40px] h-[40px] text-red-900" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {" "}
                <p>There is no items in your basket.</p>
                <Link href="/Pages/menu">
                  <button className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md transition duration-300">
                    Go Menu
                  </button>
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div>
              <div>
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={data}
                  textColors={["#ffffff"]}
                  onStopSpinning={handleStopSpinning}
                  strokeWidth={0}
                  shadowColor="none"
                  outerBorderColor={["#ccc"]}
                  outerBorderWidth={[0]}
                  innerBorderColor={["#f2f2f2"]}
                  radiusLineColor={["tranparent"]}
                  radiusLineWidth={[1]}
                  backgroundColors={[
                    "#169ed8", // Sky Blue (Açıq Mavi)
                    "#64b031", // Lime Green (Açıq Yaşıl)
                    "#e5177b", // Pink (Çəhrayı)
                    "#871f7f", // Dark Purple (Tünd Bənövşəyi)
                    "#dc0936", // Red (Qırmızı)
                    "#3f297e", // Dark Blue (Tünd Mavi)
                    "#e6471d", // Red Orange (Qırmızı Narıncı)
                  ]}
                  style={{
                    outline: "none",
                    boxShadow: "none",
                    border: "none",
                    margin: 0,
                    padding: 0,
                  }}
                />
              </div>
            </div>
            <div className="cart-summary w-[100%]">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <p>Sale: {selectedPrize || "Spin the wheel after ordering"}</p>
                <strong>Total</strong>
                {isOrderPlaced && orderSnapshot.current ? (
                  <>
                    <del>{orderSnapshot.current.total.toFixed(2)}₼</del>
                    <span>{discountedTotal.toFixed(2)}₼</span>
                    <p>
                      You saved:{" "}
                      {(orderSnapshot.current.total - discountedTotal).toFixed(2)}₼
                      <br />
                      Your balance: {balanceAfter !== null ? balanceAfter.toFixed(2) : "-"}₼
                    </p>
                  </>
                ) : (
                  <span>{formattedTotalPrice}₼</span>
                )}
              </div>
              <button
                className="checkout-btn"
                onClick={handleOrderClick}
                disabled={mustSpin || isOrderPlaced}
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default Basket;
