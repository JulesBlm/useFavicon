import * as React from "react";
import { useEffect, useState } from "react";
import {
  drawTextBubble,
  drawCircle,
  drawSquare,
  useFavicon,
} from "./usefavicon.modern";
import "./App.css";

const TextDemoItem = ({ drawOnFavicon }) => {
  const [input, setInput] = useState("5");

  return (
    <div className="Demo-Item">
      <div>
        Draw a notification bubble with text
        <div>
          <label className="Text-Label" htmlFor="bubble-content">
            Text
          </label>
          <input
            className="Text-Input"
            id="bubble-content"
            onChange={({ target }) => setInput(target.value)}
            value={input}
            type="text"
            maxLength="4"
            size="4"
          />
        </div>
      </div>
      <button
        className="Button"
        onClick={() =>
          drawOnFavicon(drawTextBubble, {
            faviconSize: 256,
            clear: false,
            color: "crimson",
            label: input,
          })
        }
      >
        Draw text bubble
      </button>
    </div>
  );
};

const demoSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="256"
    height="256"
    viewBox="0 0 100 100"
  >
    <rect width="100" height="100" rx="20" fill="black" />
    <path
      fill="hotpink"
      d="M36.63 22.42L66.52 22.42Q66.78 22.87 67.06 23.63Q67.32 24.40 67.32 25.30L67.32 25.30Q67.32 26.83 66.60 27.73Q65.88 28.63 64.53 28.63L64.53 28.63L40.05 28.63L40.05 47.35L63.36 47.35Q63.63 47.80 63.91 48.56Q64.17 49.33 64.17 50.23L64.17 50.23Q64.17 51.76 63.45 52.66Q62.73 53.56 61.38 53.56L61.38 53.56L40.05 53.56L40.05 77.05Q39.60 77.23 38.66 77.41Q37.71 77.59 36.72 77.59L36.72 77.59Q32.67 77.59 32.67 74.34L32.67 74.34L32.67 26.38Q32.67 24.58 33.75 23.50Q34.84 22.42 36.63 22.42L36.63 22.42Z"
    />
  </svg>
);

const someEmojis = [
  "😎",
  "👹",
  "👻",
  "👔",
  "🎒",
  "🧀",
  "❤️",
  "💯",
  "⚛️",
  "🌇",
  "🏞",
  "🌅",
  "🏙",
  "⚽️",
  "🦦",
  "🦥",
  "🦧",
  "🐳",
  "🍆",
  "🍔",
  "🚥",
  "📱",
  "💈",
  "💶",
  "🍿",
  "🌚",
  "🌝",
  "🌞",
  "🙉",
  "🐼",
];

function App() {
  const [faviconHref, setters] = useFavicon();

  const {
    setFaviconHref,
    restoreFavicon,
    drawOnFavicon,
    setEmojiFavicon,
    jsxToFavicon,
  } = setters;

  const randomEmoji = () =>
    someEmojis[Math.floor(Math.random() * someEmojis.length)];

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="h1">
          useFavicon{" "}
          <a
            href="https://github.com/JulesBlm/useFavicon"
            title="useFavicon GitHub Repository"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-label="GitHub"
              width="1em"
              viewBox="0 0 512 512"
            >
              <rect width="512" height="512" rx="15%" fill="#1B1817" />
              <path
                fill="#fff"
                d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"
              />
            </svg>
          </a>
        </h1>
        <img
          src={faviconHref}
          width="150px"
          height="150px"
          alt="This is a big copy of your favicon for demo purposes"
          title="This is a big copy of your favicon for demo purposes"
        />
        <h2>
          Push some of these buttons and look at your favicon
          <span role="img" aria-label="Finger pointing up">
            ☝️
          </span>
        </h2>
      </header>

      <main className="Main">
        <section className="Demo">
          <div className="Demo-Grid">
          
            <div className="Demo-Item">
              <p>
                The <code>href</code> of the initial favicon is stored so you
                can always reset it with <code>restoreFavicon()</code>
              </p>
              <button className="Button" onClick={() => restoreFavicon()}>
                Restore
              </button>
            </div>

            <div className="Demo-Item">
              <p>
                Draw a circle on top of the favicon in the lower right corner
                with <code>drawOnFavicon()</code>
              </p>
              <button
                className="Button"
                onClick={() =>
                  drawOnFavicon(drawCircle, {
                    faviconSize: 128,
                    fillColor: "crimson",
                    radius: 30,
                    x: 128 - 30,
                    y: 128 - 30,
                  })
                }
              >
                Draw circle
              </button>
            </div>
            <div className="Demo-Item">
              <p>
                Draw rectangle with default options (black, right lower corner)
                on top of the favicon
              </p>
              <button
                className="Button"
                onClick={() => drawOnFavicon(drawSquare)}
              >
                Draw rectangle
              </button>
            </div>
            <div className="Demo-Item">
              <p>
                Draw a rectangle on top of the favicon in a custom postion and
                color
              </p>
              <button
                className="Button"
                onClick={() =>
                  drawOnFavicon(drawSquare, {
                    faviconSize: 128,
                    fillColor: "crimson",
                    length: 30,
                    x: 128 - 30,
                    y: 0,
                  })
                }
              >
                Draw rectangle
              </button>
            </div>

            <TextDemoItem drawOnFavicon={drawOnFavicon} />

            <div className="Demo-Item">
              <p>
                By setting <code>clear: true</code> in the config object, the
                current favicon is removed
              </p>
              <button
                className="Button"
                onClick={() =>
                  drawOnFavicon(drawSquare, {
                    faviconSize: 256,
                    fillColor: "purple",
                    clear: true,
                  })
                }
              >
                Clear favicon and draw rectangle
              </button>
            </div>

            <div className="Demo-Item">
              <p>
                If you have another favicon in your static folder, you can
                easily set it to that with <code>setFaviconHref()</code>
              </p>
              <button
                className="Button"
                onClick={() => setFaviconHref("/favicon.svg")}
              >
                Set to another static image
              </button>
            </div>

            <div className="Demo-Item">
              <p>
                Construct a React SVG element with <abbr>JSX</abbr> and pass
                that to <code>jsxToFavicon()</code>, note{" "}
                <mark>
                  only React elements of type <code>svg</code>
                </mark>{" "}
                will work.
              </p>
              <pre className="code-block">
                <code>
                  {`const faviconSvgEl = (<svg
  xmlns="http://www.w3.org/2000/svg"
  width="256"
  height="256"
  viewBox="0 0 100 100"
>
  <rect
    width="100"
    height="100"
    rx="20"
    fill="black"
  />
  {/* Path of letter F */}
  <path
    fill="hotpink"
    d="M36.63 22.42L66....."
  />
</svg>)

// from JSX to Favicon!🪄,
jsxToFavicon(faviconSvgEl)
`}
                </code>
              </pre>
              <button className="Button" onClick={() => jsxToFavicon(demoSvg)}>
                Set favicon with JSX
              </button>
            </div>

            <div className="Demo-Item">
              <p>
                Set an emoji as the favicon with <code>setEmojiFavicon()</code>,
                credits to{" "}
                <a href="https://twitter.com/LeaVerou/status/1241619866475474946?s=20">
                  Lea Verou
                </a>{" "}
                and{" "}
                <a
                  href="https://css-tricks.com/emojis-as-favicons/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chris Coyier
                </a>
                . Note that you can use any character not just emoji's, just
                know that they don&apos;t work as well as emoji&apos;s.
              </p>
              <button
                className="Button"
                onClick={() => setEmojiFavicon(randomEmoji())}
              >
                Set emoji favicon
              </button>
            </div>
          </div>
        </section>

        <section className="Usage">
          <h2>Usage</h2>
          <pre className="code-block">
            <code>
              {`
import { useFavicon } from "./use-favicon";
import { drawCircle, drawSquare, drawTextBubble } from "./drawFunctions";

function App() {

  const [
    faviconHref,
    { 
      restoreFavicon,
      drawOnFavicon,
      setEmojiFavicon,
      setFaviconHref
    }
  ] = useFavicon();
  
  ...
  `}
            </code>
          </pre>
        </section>
      </main>
    </div>
  );
}

export default App;
