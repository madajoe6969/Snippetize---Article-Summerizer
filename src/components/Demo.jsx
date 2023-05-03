// Importing React hooks and assets
import React, { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";

// Importing Roboto font stylesheets
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Importing the GraphQL query hook
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  // Initializing state variables using the useState hook
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  // This function is called when the user clicks the "Save" button
  function handleSave() {
    // Creating a new summary object from the current article's URL and summary
    const newSummary = { url: article.url, summary: article.summary };
    // Adding the new summary object to the summaries state array
    setSummaries([...summaries, newSummary]);
  }

  function handleExport() {
    // Convert the summaries array to a JSON string
    const summaryText = JSON.stringify(summaries);
    // Format the JSON string with newlines and indentation for readability
    const formattedText = summaryText.replace(/},{/g, "}\n\n{");
    // Create a new Blob object containing the formatted text
    const blob = new Blob([formattedText], { type: "text/plain" });
    // Generate a URL for the Blob object
    const url = URL.createObjectURL(blob);
    // Create a new <a> element with the URL as its href and a download attribute
    const a = document.createElement("a");
    a.href = url;
    a.download = "summaries.txt";
    // Append the <a> element to the DOM
    document.body.appendChild(a);
    // Simulate a click on the <a> element to initiate the download
    a.click();
    // Remove the <a> element from the DOM
    document.body.removeChild(a);
  }

  // This function is called when the user selects or deselects a section checkbox
  const handleSectionSelection = (section) => {
    // If the section is already selected, remove it from the selectedSections array
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    }
    // If the section is not selected, add it to the selectedSections array
    else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  // This JSX code displays the article search form and the list of previous articles
  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Article search form */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          {/* Link icon */}
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          {/* Article URL input */}
          <input
            type="url"
            placeholder="Paste the article link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className="url_input peer" // Add a peer class to the input element to style it based on the state of a sibling element
          />
          {/* Submit button */}
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 "
          >
            <p>↵</p>
          </button>
        </form>
      </div>

      {/* List of previous articles */}
      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
        {/* Display each previous article as a link card */}
        {allArticles.reverse().map((item, index) => (
          <div
            key={`link-${index}`}
            onClick={() => setArticle(item)}
            className="link_card"
          >
            {/* Copy button */}
            <div className="copy_btn" onClick={() => handleCopy(item.url)}>
              <img
                src={copied === item.url ? tick : copy}
                alt={copied === item.url ? "tick_icon" : "copy_icon"}
                className="w-[40%] h-[40%] object-contain"
              />
            </div>
            {/* Display the article URL */}
            <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
              {item.url}
            </p>
          </div>
        ))}
      </div>

      {/* Display Result */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : // If there is an error, display an error message with details
        error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          // If summary data is available, display the article summary
          article.summary && (
            <div className="flex flex-col gap-3 mt-6">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl py-2 px-2 flex ps-2 pt-1">
                Article <span className="blue_gradient">Summary</span>
                <div className="flex justify-end px-3 mr-2 ps-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-3"
                    onClick={handleSave}
                    title="You Must Save Summary First"
                  >
                    Save Summary
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleExport}
                    title="You Must Save Summary First"
                  >
                    Export Summaries
                  </button>
                </div>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;