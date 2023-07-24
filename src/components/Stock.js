import axios from "axios";
import React, { useEffect, useState } from "react";

const Stock = ({ symbol, priceUSD, previousCloseUSD, date }) => {
  // State variables to hold converted prices and change percentage
  const [priceTRY, setPriceTRY] = useState(null);
  const [previousCloseTRY, setPreviousCloseTRY] = useState(null);
  const [changePercentage, setChangePercentage] = useState(null);
  const [dates, setDates] = useState(null);

  // Calculate the price difference and change percentage
  const priceSub = priceUSD - previousCloseUSD;
  const changePercent = (Math.abs(priceSub) / previousCloseUSD) * 100;
  const profitOrLoss = priceSub >= 0 ? "+" : "-";

  // useEffect to fetch exchange rates and convert prices to TRY
  useEffect(() => {
    const convertToTRY = async () => {
      try {
        // Fetch exchange rates from an API
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/{YOUR_API_KEY}/latest/USD"
        );
        const exchangeRate = response.data.conversion_rates;
        const tryRate = exchangeRate["TRY"];

        // Convert prices to Turkish Lira (TRY)
        const priceTRY = priceUSD * tryRate;
        const previousCloseTRY = previousCloseUSD * tryRate;

        // Calculate the change percentage as a string with a "+" or "-" sign
        const changePercentage = profitOrLoss + changePercent + "%";

        // Set the state variables with the converted values and save them to local storage
        setPriceTRY(priceTRY);
        setPreviousCloseTRY(previousCloseTRY);
        setChangePercentage(changePercentage);
        setDates(date);

        // Save the converted values to local storage for future reference
        localStorage.setItem("priceTRY", priceTRY);
        localStorage.setItem("previousCloseTRY", previousCloseTRY);
        localStorage.setItem("changePercentage", changePercentage);
        localStorage.setItem("dates", date);
      } catch (error) {
        console.error("Exchange rate conversion is unsuccessful:", error);
      }
    };

    convertToTRY();
  }, [priceUSD, previousCloseUSD, changePercent, profitOrLoss, date]);

  // useEffect to load converted prices and change percentage from local storage on initial render
  useEffect(() => {
    const priceTRYStorage = localStorage.getItem("priceTRY");
    const previousCloseTRYStorage = localStorage.getItem("previousCloseTRY");
    const changePercentage = localStorage.getItem("changePercentage");
    const dates = localStorage.getItem("dates");

    // If there are stored values in local storage, set the state variables with them
    if (priceTRYStorage && previousCloseTRYStorage && changePercentage && dates) {
      setPriceTRY(priceTRYStorage);
      setPreviousCloseTRY(previousCloseTRYStorage);
      setChangePercentage(changePercentage);
      setDates(dates);
    }
  }, []);

  return (
    <div class="stock-info">
      <h2>{symbol}</h2>
      <p>
        Price: {parseFloat(priceUSD).toFixed(2)} USD / {parseFloat(priceTRY).toFixed(2)} TL
      </p>
      <p>
        Previous Close: {parseFloat(previousCloseUSD).toFixed(2)} USD / {parseFloat(previousCloseTRY).toFixed(2)} TL
      </p>
      <p>Change Percent: {parseFloat(changePercentage).toFixed(2)}%</p>
      <p>Date: {dates}</p>
    </div>
  );
};

export default Stock;
