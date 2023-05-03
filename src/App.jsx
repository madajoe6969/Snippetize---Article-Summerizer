// Importing Hero and Demo components from their respective files
import Hero from "./components/Hero";
import Demo from "./components/Demo";
import Copyright from './components/Copyright';

// Importing the CSS file for this component
import "./App.css";

// Defining the App component using a arrow function
const App = () => {
  // Returning JSX code for this component
  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>
      <div className="app">
        {/* Rendering the Hero and Demo components */}
        <Hero />
        <Demo />
        <Copyright />
      </div>
    </main>
  );
};

// Exporting the App component so that it can be used in other files
export default App;
