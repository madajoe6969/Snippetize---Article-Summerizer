// Importing React and logo image from the assets folder
import React from "react";
import { logo } from "../assets";

// Importing Roboto font stylesheets
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Defining the Hero component as a functional component
const Hero = () => {
  return (
    // Creating a header element with flexbox layout and center alignment
    <header className='w-full flex justify-center items-center flex-col'>
      {/* Creating a navigation bar with logo and blog button */}
      <nav className='flex justify-between items-center w-full mb-10 pt-3'>
        <img src={logo} alt='sumz_logo' className='w-28 object-contain' />

        <button
          type='button'
          onClick={() =>
            window.open("https://enginewp.com/", "_blank")
          }
          className='black_btn'
        >
          Blog
        </button>
      </nav>

      {/* Creating a heading with a line break and gradient-colored span */}
      <h1 className='head_text'>
        Snippetize Articles with <br className='max-md:hidden' />
        <span className='orange_gradient '>OpenAI GPT-4</span>
      </h1>
      {/* Creating a subheading for the article summarizer */}
      <h2 className='desc'>
        Simplify your reading with Snippetize, an open-source article summarizer
        that transforms lengthy articles into clear and concise summaries
      </h2>
    </header>
  );
};

// Exporting the Hero component as the default export
export default Hero;