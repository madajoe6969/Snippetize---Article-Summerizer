// Importing the necessary modules from the React library
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// Importing the App component and the store from their respective files
import App from "./App";
import { store } from "./services/store";

// Rendering the App component inside the root element of the HTML document
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrapping the App component inside the Provider component, which provides the store to all the components */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
