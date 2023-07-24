import React, { useState, useEffect } from "react";
import axios from "axios";
import Stock from "./Stock";
import StockDateData from "./StockDateData";

const StockList = () => {
  // State variables to manage the stock data and related suggestions
  const [stockSymbol, setStockSymbol] = useState("AAPL"); // Default stock name
  const [stockData, setStockData] = useState(null); // Current stock data
  const [previousDayData, setPreviousDayData] = useState(null); // Previous day's stock data
  const [suggestion, setSuggestion] = useState([]); // Suggested stocks based on user input
  const [oldSuggestion, setOldSuggestion] = useState([]); // Previous suggestions

  // useEffect to fetch initial stock data on component mount
  useEffect(() => {
    if (stockData === null) {
      fetchStockData();
    }
  });

  // Function to fetch stock data from the API
  const fetchStockData = async () => {
    try {
      // Fetching current stock data for the given stock symbol
      const minData = await axios.get(
        `https://api.twelvedata.com/time_series?apikey={YOUR_API_KEY}&interval=1min&symbol=${stockSymbol}`
      );
      const latestData = minData.data.values[0];

      // Fetching previous day's stock data for the given stock symbol
      const dayData = await axios.get(
        `https://api.twelvedata.com/time_series?apikey={YOUR_API_KEY}&interval=1day&previous_close=true&symbol=${stockSymbol}`
      );

      // Setting the state variables with the fetched stock data
      setPreviousDayData(dayData.data.values);
      setStockData(latestData);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle changes in the input field (stock symbol)
  const handleChange = async (e) => {
    const inputSymbol = e.target.value;
    setStockSymbol(inputSymbol);

    if (!inputSymbol) {
      // Don't suggest when the input is empty
      setSuggestion([]);
      return;
    }

    // Handling backspace to show previous suggestion
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      const latestSuggestion = oldSuggestion.pop();
      if (latestSuggestion) {
        setSuggestion(latestSuggestion);
      } else {
        setSuggestion([]);
      }
      return; // To not see backspace as a transaction
    }

    const searchQuery = inputSymbol;

    try {
      // Fetching stock data suggestions based on the user's input
      axios
        .get(
          `https://api.polygon.io/v3/reference/tickers?market=stocks&search=${searchQuery}&active=true&limit=1000&apiKey={YOUR_API_KEY}`
        )
        .then((res) => {
          let oldSuggestions = oldSuggestion;
          oldSuggestions.push(suggestion);
          setOldSuggestion(oldSuggestion);

          return res.data.results;
        })
        .then((results) => {
          if (results && results.length > 0) {
            // Filtering and mapping the suggested stocks from the API results
            const suggestedStocks = results
              .filter((result) => result.ticker.startsWith(searchQuery))
              .map((result) => result.ticker);
            setSuggestion(suggestedStocks);
          } else {
            setSuggestion([]);
          }
        });
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // Function to handle the "Enter" key press to fetch stock data
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSuggestion([]);
      fetchStockData();
    }
  };

  return (
    <div class="stock-list">
      {/* Input field for stock symbol */}
      <input
        type="text"
        id="text"
        value={stockSymbol}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {suggestion.length > 0 && (
        <ul>
          {/* Displaying suggested stock symbols */}
          {suggestion.map((suggestedStock, index) => (
            <li key={index}>{suggestedStock}</li>
          ))}
        </ul>
      )}
      {stockData ? (
        // Displaying the current stock data in the Stock component
        <Stock
          symbol={stockSymbol}
          priceUSD={stockData.open}
          previousCloseUSD={previousDayData[0].close ?? undefined}
          date={stockData.datetime}
        />
      ) : (
        <p>Loading...</p>
      )}

      {/* Displaying additional stock data from the previous day in the StockDateData component */}
      <StockDateData stockData={previousDayData} />
    </div>
  );
};

export default StockList;
