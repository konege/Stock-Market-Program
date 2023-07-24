import React, { useEffect, useState } from "react";

const StockDateData = (props) => {
  const [selectedDays, setSelectedDays] = useState(0);

  // useEffect to fetch stock data or perform any other necessary actions when selectedDays changes
  useEffect(() => {
    // Fetch stock data or perform any other necessary actions based on selectedDays
    // This effect will be triggered whenever the value of selectedDays changes
  }, [selectedDays]);

  // Function to calculate the percentage change between two prices
  const calculatePercentageChange = (startPrice, endPrice) => {
    const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
    return percentageChange.toFixed(2);
  };

  // Function to handle changes in the input field (selectedDays)
  const handleChange = (event) => {
    setSelectedDays(parseInt(event.target.value));
  };

  return (
    <div class="day-change-input">
      {/* Input field for selecting the number of days */}
      <p>Number of Dates: </p>
      <label htmlFor="days"></label>
      <input
        type="number"
        id="days"
        value={selectedDays}
        onChange={handleChange}
        max={29}
        min={0}
      />
      <br />
      <h3>
        <strong>Last {selectedDays} Day Change : </strong>
      </h3>
      {/* Displaying the list of percentage changes for the selected number of days */}
      {props.stockData && props.stockData.length > 0 && selectedDays ? (
        <ul id="daily_change">
          {props.stockData.slice(0, selectedDays).map((data, index) => {
            const { datetime, close } = data;
            const previousData = props.stockData[index + 1];
            const percentChange = previousData
              ? calculatePercentageChange(previousData.close, close)
              : undefined;

            // Formatting date strings to display in the list item
            const formattedDateTime =
              new Date(datetime).getMonth() +
              1 +
              "/" +
              new Date(datetime).getDate();
            const formattedPreviousDate = previousData
              ? new Date(previousData.datetime).getMonth() +
                1 +
                "/" +
                new Date(previousData.datetime).getDate()
              : "";
            const dateRange = formattedPreviousDate
              ? `${formattedPreviousDate} - ${formattedDateTime} -->`
              : formattedDateTime;

            return (
              <>
                {/* Displaying each list item with date range and percentage change */}
                <li key={dateRange}>
                  <div class="date">
                    <span class="date-item">{formattedPreviousDate}</span>
                    -
                    <span class="date-item">{formattedDateTime}</span>
                  </div>
                  <span class="percentage">
                    %{percentChange !== undefined ? percentChange : "N/A"}
                  </span>
                </li>
              </>
            );
          })}
        </ul>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default StockDateData;
