import { useEffect, useRef, useState } from "react";
import "./BubbleSort.css";

const INITIAL_ARRAY = [9, 3, 4, 1, 8, 2];

function BubbleSort() {
  // =========================================================
  // ITEMS
  // =========================================================
  // Every character gets a permanent ID.
  // The ID never changes.
  //
  // Example:
  // ID 0 -> value 9
  // ID 1 -> value 3
  // ID 2 -> value 4
  // etc.
  //
  // When characters swap, the characters themselves don't
  // change. Only their positions change.
  // =========================================================

  const [items, setItems] = useState(
    INITIAL_ARRAY.map((value, index) => ({
      id: index,
      value,
    }))
  );

  // =========================================================
  // POSITIONS
  // =========================================================
  // position 0 = first position
  // position 1 = second position
  // etc.
  //
  // Example initially:
  //
  // character 0 -> position 0
  // character 1 -> position 1
  // character 2 -> position 2
  // =========================================================

  const [positions, setPositions] = useState(
    Object.fromEntries(
      INITIAL_ARRAY.map((_, index) => [index, index])
    )
  );

  const [active, setActive] = useState([]);
  const [sorted, setSorted] = useState([]);

  const [message, setMessage] = useState(
    "Press Start to begin Bubble Sort!"
  );

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const [speed, setSpeed] = useState(700);

  // Ref allows the running algorithm to get the latest speed.
  const speedRef = useRef(700);

  // Used for pause/resume.
  const pausedRef = useRef(false);

  // Used to stop an old sorting animation.
  const stopRef = useRef(false);


  // =========================================================
  // WAIT
  // =========================================================
  // This wait function:
  //
  // 1. Supports pause
  // 2. Supports reset/stop
  // 3. Uses the latest speed value
  // =========================================================

  const wait = (duration) => {
    return new Promise((resolve) => {

      let progress = 0;
      let lastTime = Date.now();

      const check = () => {

        // Stop immediately if reset was pressed.
        if (stopRef.current) {
          resolve();
          return;
        }

        const now = Date.now();
        const delta = now - lastTime;

        lastTime = now;

        // Don't progress while paused.
        if (!pausedRef.current) {

          // Speed slider affects the animation currently running.
          progress += delta / duration;
        }

        if (progress >= 1) {
          resolve();
          return;
        }

        setTimeout(check, 20);
      };

      check();
    });
  };


  // =========================================================
  // RESET
  // =========================================================

  const reset = () => {

    // Tell currently running animation to stop.
    stopRef.current = true;

    pausedRef.current = false;

    const newItems = INITIAL_ARRAY.map((value, index) => ({
      id: index,
      value,
    }));

    setItems(newItems);

    setPositions(
      Object.fromEntries(
        INITIAL_ARRAY.map((_, index) => [index, index])
      )
    );

    setActive([]);
    setSorted([]);

    setRunning(false);
    setPaused(false);

    setMessage("Press Start to begin Bubble Sort!");

    // Allow a new animation to start shortly after reset.
    setTimeout(() => {
      stopRef.current = false;
    }, 50);
  };


  // =========================================================
  // BUBBLE SORT
  // =========================================================

  const bubbleSort = async () => {

    // Don't start if already running.
    if (running) return;

    stopRef.current = false;
    pausedRef.current = false;

    setRunning(true);
    setPaused(false);

    // Local copy used by the algorithm.
    let arr = INITIAL_ARRAY.map((value, index) => ({
      id: index,
      value,
    }));

    const n = arr.length;


    // =======================================================
    // OUTER LOOP
    // =======================================================

    for (let i = 0; i < n - 1; i++) {

      // =====================================================
      // INNER LOOP
      // =====================================================

      for (let j = 0; j < n - i - 1; j++) {

        if (stopRef.current) {
          return;
        }


        // ===================================================
        // COMPARE
        // ===================================================

        const leftItem = arr[j];
        const rightItem = arr[j + 1];

        setActive([
          leftItem.id,
          rightItem.id,
        ]);

        setMessage(
          `Comparing ${leftItem.value} and ${rightItem.value}`
        );

        await wait(speedRef.current);


        if (stopRef.current) {
          return;
        }


        // ===================================================
        // SWAP
        // ===================================================

        if (leftItem.value > rightItem.value) {

          setMessage(
            `${leftItem.value} > ${rightItem.value} → Swap!`
          );

          await wait(250);


          // IDs of the two characters.
          const leftId = leftItem.id;
          const rightId = rightItem.id;


          // -------------------------------------------------
          // MOVE THE CHARACTERS VISUALLY
          // -------------------------------------------------
          //
          // Character on left moves to right position.
          //
          // Character on right moves to left position.
          // -------------------------------------------------

          setPositions((prev) => ({
            ...prev,

            [leftId]: j + 1,
            [rightId]: j,
          }));


          // Wait for physical movement.
          await wait(650);


          if (stopRef.current) {
            return;
          }


          // -------------------------------------------------
          // SWAP IN ALGORITHM ARRAY
          // -------------------------------------------------

          const temp = arr[j];

          arr[j] = arr[j + 1];

          arr[j + 1] = temp;

        } else {

          setMessage(
            `${leftItem.value} < ${rightItem.value} → No swap`
          );

          await wait(speedRef.current);
        }


        // Remove comparison highlight.
        setActive([]);
      }


      // =====================================================
      // LARGEST ELEMENT IS NOW SORTED
      // =====================================================

      const sortedId = arr[n - i - 1].id;

      setSorted((prev) => [
        ...prev,
        sortedId,
      ]);

      setMessage(
        `${arr[n - i - 1].value} is in its correct position ✓`
      );

      await wait(400);
    }


    // =======================================================
    // FIRST ELEMENT IS ALSO SORTED
    // =======================================================

    setSorted((prev) => [
      ...prev,
      arr[0].id,
    ]);

    setActive([]);

    setRunning(false);
    setPaused(false);

    setMessage(
      "🎉 Array Sorted Successfully!"
    );
  };


  // =========================================================
  // PAUSE / RESUME
  // =========================================================

  const togglePause = () => {

    if (!running) return;


    if (paused) {

      pausedRef.current = false;

      setPaused(false);

      setMessage("Sorting resumed...");

    } else {

      pausedRef.current = true;

      setPaused(true);

      setMessage("⏸ Sorting paused");
    }
  };


  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {

    return () => {
      stopRef.current = true;
    };

  }, []);


  // =========================================================
  // JSX
  // =========================================================

  return (

    <div className="app">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="header">

        <div className="logo">

          <span className="logo-icon">
            ⚡
          </span>

          CodeSpace

        </div>


        <div className="tagline">
          Learn algorithms visually.
        </div>

      </header>


      <main className="container">


        {/* =================================================
            TITLE
        ================================================= */}

        <section className="title-section">

          <div className="badge">
            ALGORITHM VISUALIZER
          </div>

          <h1>
            Bubble <span>Sort</span>
          </h1>

          <p>
            Watch the characters compare and swap
            step-by-step.
          </p>

        </section>


        {/* =================================================
            VISUALIZER
        ================================================= */}

        <section className="visualizer">


          {/* =================================================
              VISUALIZER HEADER
          ================================================= */}

          <div className="visualizer-header">

            <div>

              <h2>
                Bubble Sort
              </h2>

              <p className="message">
                {message}
              </p>

            </div>


            <div className="complexity">

              <div>

                <span>
                  Time
                </span>

                <strong>
                  O(n²)
                </strong>

              </div>


              <div>

                <span>
                  Space
                </span>

                <strong>
                  O(1)
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              CHARACTER STAGE
          ================================================= */}

          <div className="characters-container">

            <div className="characters">

              {items.map((item) => {

                const position = positions[item.id];

                const isActive =
                  active.includes(item.id);

                const isSorted =
                  sorted.includes(item.id);


                // Bigger value = taller character.
                //
                // 1 -> 80px
                // 2 -> 90px
                // 3 -> 100px
                // ...
                // 9 -> 160px

                const height =
                  70 + item.value * 10;


                return (

                  <div
                    key={item.id}

                    className={`
                      character-wrapper
                      ${isActive ? "active" : ""}
                      ${isSorted ? "sorted" : ""}
                    `}

                    style={{
                      left: `${80 + position * 120}px`,
                    }}
                  >


                    {/* NUMBER */}

                    <div className="number">
                      {item.value}
                    </div>


                    {/* =================================================
                        MINION
                    ================================================= */}

                    <div
                      className="minion"

                      style={{
                        height: `${height}px`,
                      }}
                    >


                      {/* GOGGLES */}

                      <div className="goggles">

                        <div className="goggle">

                          <div className="eye">

                            <div className="pupil"></div>

                          </div>

                        </div>


                        <div className="goggle">

                          <div className="eye">

                            <div className="pupil"></div>

                          </div>

                        </div>

                      </div>


                      {/* MOUTH */}

                      <div className="mouth"></div>


                      {/* OVERALL */}

                      <div className="overall"></div>


                      {/* ARMS */}

                      <div className="arm left"></div>

                      <div className="arm right"></div>


                      {/* FEET */}

                      <div className="feet">

                        <div className="foot"></div>

                        <div className="foot"></div>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>


          {/* =================================================
              CONTROLS
          ================================================= */}

          <div className="controls">


            {/* START */}

            <button
              className="primary-btn"

              onClick={bubbleSort}

              disabled={running}
            >
              ▶ Start
            </button>


            {/* PAUSE */}

            <button
              className="secondary-btn"

              onClick={togglePause}

              disabled={!running}
            >

              {paused
                ? "▶ Resume"
                : "⏸ Pause"
              }

            </button>


            {/* RESET */}

            <button
              className="secondary-btn"

              onClick={reset}
            >
              ↻ Reset
            </button>


            {/* SPEED */}

            <div className="speed-control">

              <span>
                Speed
              </span>


              <input
                type="range"

                min="200"

                max="1200"

                step="100"

                value={speed}

                onChange={(e) => {

                  const newSpeed =
                    Number(e.target.value);

                  setSpeed(newSpeed);

                  speedRef.current =
                    newSpeed;
                }}
              />


              <span className="speed-value">
                {speed}ms
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            EXPLANATION
        ================================================= */}

        <section className="explanation">


          <div className="explanation-card">

            <div className="step-number">
              01
            </div>

            <div>

              <h3>
                Compare adjacent elements
              </h3>

              <p>
                Bubble Sort compares two
                neighboring elements.
              </p>

            </div>

          </div>


          <div className="explanation-card">

            <div className="step-number">
              02
            </div>

            <div>

              <h3>
                Swap if necessary
              </h3>

              <p>
                If the left element is larger,
                the two characters switch places.
              </p>

            </div>

          </div>


          <div className="explanation-card">

            <div className="step-number">
              03
            </div>

            <div>

              <h3>
                Repeat
              </h3>

              <p>
                The largest unsorted element
                moves toward the end.
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            CODE
        ================================================= */}

        <section className="code-section">


          <div className="code-header">

            <span>
              JavaScript
            </span>

            <span>
              Bubble Sort
            </span>

          </div>


          <pre>
{`function bubbleSort(arr) {

  for (let i = 0; i < arr.length - 1; i++) {

    for (let j = 0; j < arr.length - i - 1; j++) {

      if (arr[j] > arr[j + 1]) {

        [arr[j], arr[j + 1]] =
        [arr[j + 1], arr[j]];

      }
    }
  }
}`}
          </pre>

        </section>

      </main>

    </div>
  );
}

export default BubbleSort;