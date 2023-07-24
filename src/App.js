import React from "react";
import StockList from "./components/StockList";

const App = () => {
  return (
    <div>
      {/* Adding a Google Fonts link to import the "Open Sans" font */}
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');
      </style>
      <h1>Stock Market Program</h1>
      {/* Rendering the StockList component */}
      <StockList />
    </div>
  );
};

export default App;
