import { useEffect, useRef, useState } from "react";
import "./InsertionSort.css";

const INITIAL_ARRAY = [9, 3, 4, 1, 8, 2];

function InsertionSort() {

  const [items] = useState(
    INITIAL_ARRAY.map((value, index) => ({
      id: index,
      value,
    }))
  );

  const [positions, setPositions] = useState(
    Object.fromEntries(
      INITIAL_ARRAY.map((_, index) => [index, index])
    )
  );

  const [active, setActive] = useState([]);
  const [shifting, setShifting] = useState([]);
  const [sorted, setSorted] = useState([]);

  const [message, setMessage] = useState(
    "Press Start to begin Insertion Sort!"
  );

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const [speed, setSpeed] = useState(700);
  const speedRef = useRef(700);

  const pausedRef = useRef(false);
  const stopRef = useRef(false);


  // =========================
  // WAIT
  // =========================

  const wait = (ms) => {

    return new Promise((resolve) => {

      const check = () => {

        if (stopRef.current) {
          resolve();
          return;
        }

        if (!pausedRef.current) {
          setTimeout(resolve, ms);
        } else {
          setTimeout(check, 100);
        }

      };

      check();

    });

  };


  // =========================
  // RESET
  // =========================

  const reset = () => {

    stopRef.current = true;
    pausedRef.current = false;

    setPositions(
      Object.fromEntries(
        INITIAL_ARRAY.map((_, index) => [index, index])
      )
    );

    setActive([]);
    setShifting([]);
    setSorted([]);

    setRunning(false);
    setPaused(false);

    setMessage(
      "Press Start to begin Insertion Sort!"
    );

    setTimeout(() => {
      stopRef.current = false;
    }, 100);

  };


  // =========================
  // INSERTION SORT
  // =========================

  const insertionSort = async () => {

    if (running) return;

    stopRef.current = false;
    pausedRef.current = false;

    setRunning(true);
    setPaused(false);

    let arr = INITIAL_ARRAY.map(
      (value, index) => ({
        id: index,
        value,
      })
    );

    const n = arr.length;


    try {

      // =========================
      // FIRST ELEMENT
      // =========================

      setActive([arr[0].id]);
      setSorted([arr[0].id]);

      setMessage(
        `${arr[0].value} is already sorted ✓`
      );

      await wait(500);


      // =========================
      // MAIN LOOP
      // =========================

      for (let i = 1; i < n; i++) {

        if (stopRef.current) return;

        const current = arr[i];


        // =========================
        // PICK
        // =========================

        setActive([current.id]);
        setShifting([]);

        setMessage(
          `Picking ${current.value}`
        );

        await wait(speedRef.current);


        // =========================
        // LIFT
        // =========================

        setMessage(
          `Lift ${current.value} above the array`
        );

        await wait(500);


        let j = i - 1;


        // =========================
        // SHIFT
        // =========================

        while (
          j >= 0 &&
          arr[j].value > current.value
        ) {

          if (stopRef.current) return;

          const bigger = arr[j];

          setActive([current.id]);
          setShifting([bigger.id]);

          setMessage(
            `${bigger.value} > ${current.value} → Shift ${bigger.value} right`
          );

          await wait(speedRef.current);


          // Move bigger box right
          setPositions((prev) => ({
            ...prev,
            [bigger.id]: j + 1,
          }));

          await wait(650);


          // Update logical array
          arr[j + 1] = arr[j];

          j--;

        }


        if (stopRef.current) return;


        // =========================
        // MOVE CURRENT
        // =========================

        setShifting([]);
        setActive([current.id]);

        setMessage(
          `${current.value} → Move to position ${j + 1}`
        );

        setPositions((prev) => ({
          ...prev,
          [current.id]: j + 1,
        }));

        await wait(650);


        // =========================
        // DROP
        // =========================

        setMessage(
          `Insert ${current.value} into position ${j + 1}`
        );

        await wait(500);


        arr[j + 1] = current;


        // =========================
        // SORTED
        // =========================

        setSorted(
          arr
            .slice(0, i + 1)
            .map((item) => item.id)
        );

        setActive([]);
        setShifting([]);

        setMessage(
          `${current.value} is in the sorted portion ✓`
        );

        await wait(400);

      }


      // =========================
      // COMPLETE
      // =========================

      setPositions(
        Object.fromEntries(
          arr.map((item, index) => [
            item.id,
            index,
          ])
        )
      );

      setActive([]);
      setShifting([]);

      setSorted(
        arr.map((item) => item.id)
      );

      setMessage(
        "🎉 Array Sorted Successfully!"
      );

    } finally {

      setRunning(false);
      setPaused(false);

    }

  };


  // =========================
  // PAUSE
  // =========================

  const togglePause = () => {

    if (!running) return;

    if (paused) {

      pausedRef.current = false;
      setPaused(false);

      setMessage(
        "Sorting resumed..."
      );

    } else {

      pausedRef.current = true;
      setPaused(true);

      setMessage(
        "⏸ Sorting paused"
      );

    }

  };


  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {

    return () => {
      stopRef.current = true;
    };

  }, []);


  return (

    <div className="insertion-app">

      {/* HEADER */}

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


        {/* TITLE */}

        <section className="title-section">

          <div className="badge">
            ALGORITHM VISUALIZER
          </div>

          <h1>
            Insertion <span>Sort</span>
          </h1>

          <p>
            Watch each element get picked,
            shifted and inserted.
          </p>

        </section>


        {/* VISUALIZER */}

        <section className="visualizer">


          <div className="visualizer-header">

            <div>

              <h2>
                Insertion Sort
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


          {/* =========================
              ARRAY VISUALIZATION
          ========================= */}

          <div className="insertion-stage">


            {/* FIXED SLOTS */}

            <div className="array-boxes">

              {INITIAL_ARRAY.map((_, index) => (

                <div
                  key={index}
                  className="array-box"
                >
                  {index + 1}
                </div>

              ))}

            </div>


            {/* MOVING BOXES */}

            <div className="insertion-characters">

              {items.map((item) => {

                const position =
                  positions[item.id];

                const isActive =
                  active.includes(item.id);

                const isShifting =
                  shifting.includes(item.id);

                const isSorted =
                  sorted.includes(item.id);


                return (

                  <div

                    key={item.id}

                    className={`
                      insertion-character
                      ${isActive ? "active" : ""}
                      ${isShifting ? "shifting" : ""}
                      ${isSorted ? "sorted" : ""}
                    `}

                    style={{
                      left: `${position * 120}px`,
                    }}

                  >

                    <div className="value-box">

                      {item.value}

                    </div>

                    <div className="position-number">

                      {position + 1}

                    </div>

                  </div>

                );

              })}

            </div>

          </div>


          {/* CONTROLS */}

          <div className="controls">

            <button
              className="primary-btn"
              onClick={insertionSort}
              disabled={running}
            >
              ▶ Start
            </button>


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


            <button
              className="secondary-btn"
              onClick={reset}
            >
              ↻ Reset
            </button>


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

            </div>

          </div>

        </section>


        {/* EXPLANATION */}

        <section className="explanation">

          <div className="explanation-card">

            <div className="step-number">
              01
            </div>

            <div>

              <h3>
                Pick an element
              </h3>

              <p>
                Pick the next element from the
                unsorted portion.
              </p>

            </div>

          </div>


          <div className="explanation-card">

            <div className="step-number">
              02
            </div>

            <div>

              <h3>
                Shift larger elements
              </h3>

              <p>
                Larger elements move one position
                to the right.
              </p>

            </div>

          </div>


          <div className="explanation-card">

            <div className="step-number">
              03
            </div>

            <div>

              <h3>
                Insert the element
              </h3>

              <p>
                The selected element moves into
                the empty position.
              </p>

            </div>

          </div>

        </section>


        {/* CODE */}

        <section className="code-section">

          <div className="code-header">

            <span>
              JavaScript
            </span>

            <span>
              Insertion Sort
            </span>

          </div>


          <pre>
{`function insertionSort(arr) {

  for (let i = 1; i < arr.length; i++) {

    let current = arr[i];
    let j = i - 1;

    while (
      j >= 0 &&
      arr[j] > current
    ) {

      arr[j + 1] = arr[j];

      j--;
    }

    arr[j + 1] = current;
  }
}`}
          </pre>

        </section>

      </main>

    </div>

  );
}

export default InsertionSort;