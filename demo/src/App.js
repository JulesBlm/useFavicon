/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import { useEffect, useState } from "react";
// parcel breaks when importing from files one level up
import { drawBubble, drawCircle, drawRect, useFavicon } from "./index.es";
import "./App.css";

const StatefulDemoItem = ({ drawOnFavicon, restoreFavicon }) => {
  const [isOutdated, setIsOutdated] = useState(false);

  // Yes i know I shouldn't ignore drawOnFavicon an restoreFavicon in deps array
  useEffect(() => {
    if (isOutdated) {
      drawOnFavicon(drawCircle, {
        faviconSize: 128,
        fillColor: "purple",
        radius: 40,
        x: 128 - 60,
        y: 128 / 2,
      });
    } else {
      restoreFavicon();
    }
  }, [isOutdated]);

  return (
    <div className="Demo-Item">
      <p>
        Make your favicon react to state with a simple <code>useEffect</code>.
        <code>drawOnFavicon</code> when it's true and{" "}
        <code>restoreFavicon</code> when it's not.
        {/* for example to notify the user if something's outdated. */}
      </p>
      <div className="State-Pill" title="Current state">
        <label>Outdated: </label>
        <output>{isOutdated.toString()}</output>
      </div>
      <button
        className="Button"
        onClick={() => setIsOutdated((state) => !state)}
      >
        Toggle state
      </button>
    </div>
  );
};

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
          drawOnFavicon(drawBubble, {
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

function App() {
  const {
    faviconHref,
    restoreFavicon,
    drawOnFavicon,
    setEmojiFavicon,
    setFaviconHref,
  } = useFavicon();

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
          width={"150px"}
          height={"150px"}
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
        <div className="Demo">
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
                onClick={() => drawOnFavicon(drawRect)}
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
                  drawOnFavicon(drawRect, {
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
            <StatefulDemoItem
              drawOnFavicon={drawOnFavicon}
              restoreFavicon={restoreFavicon}
            />
            <TextDemoItem drawOnFavicon={drawOnFavicon} />

            <div className="Demo-Item">
              <p>
                By setting <code>clear: true</code> in the config object, the
                existing favicon is removed
              </p>
              <button
                className="Button"
                onClick={() =>
                  drawOnFavicon(drawRect, {
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
                . Note that you can use any character, just know that they don't
                work as well as emoji's.
              </p>
              <button
                className="Button"
                onClick={() => setEmojiFavicon(randomEmoji())}
              >
                Set emoji favicon
              </button>
            </div>
          </div>
        </div>

        <div className="Usage">
          <h2>Usage</h2>
          <pre className="code-block">
            <code>
              {`
import { useFavicon } from "./useFavicon";
import { drawCircle, drawRect, drawBubble } from "./drawFunctions";

function App() {

  const {
    faviconHref,
    restoreFavicon,
    drawOnFavicon,
    setEmojiFavicon,
    setFaviconHref,
  } = useFavicon();
  
  ...
  `}
            </code>
          </pre>
        </div>
      </main>
    </div>
  );
}

export default App;
