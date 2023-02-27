import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useLocalStorage from "use-local-storage";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./pages/Home";
import Timer from "./pages/Timer";
import View from "./pages/View";
import ViewTimes from "./pages/ViewTimes";
import FinishNewTimer from "./pages/FinishNewTimer";
import ViewDetails from "./pages/ViewDetails";
import EditTimer from "./pages/EditTimer";
import FinishExistingTimer from "./pages/FinishExistingTimer";

function App() {
  // creating themes for app
  // const defaultDark = window.matchMedia("(prefers-color-scheme: dark").matches;
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const lightTheme = () => {
    setTheme("light");
    document.getElementById("logo").src = "/assets/logos/webapp_default.png";
  };

  const darkTheme = () => {
    setTheme("dark");
    document.getElementById("logo").src = "/assets/logos/webapp_dark.png";
  };

  const nineKnineTheme = () => {
    setTheme("9009");
    document.getElementById("logo").src = "/assets/logos/webapp_9009.png";
  };

  const botanicalTheme = () => {
    setTheme("botanical");
    document.getElementById("logo").src = "/assets/logos/webapp_botanical.png";
  };

  const modoTheme = () => {
    setTheme("modo");
    document.getElementById("logo").src = "/assets/logos/webapp_modo.png";
  };

  return (
    <div data-theme={theme}>
      <img
        src="/assets/logos/webapp_default.png"
        alt="The KeebCompanion logo"
        id="logo"
      />
      <button className="btn" id="modoThemeBtn" onClick={modoTheme}>
        Modern Dolch
      </button>
      <button className="btn" id="botanicalThemeBtn" onClick={botanicalTheme}>
        Botanical
      </button>
      <button className="btn" id="nineKnineThemeBtn" onClick={nineKnineTheme}>
        9009
      </button>
      <button className="btn" id="darkThemeBtn" onClick={darkTheme}>
        Dark
      </button>
      <button className="btn" id="defaultThemeBtn" onClick={lightTheme}>
        Default
      </button>
      <h2 id="themesHeader"> Themes: </h2>
      <BrowserRouter>
        <div className="App">
          <ToastContainer position="top-center" />
          <Routes>
            {/* The path attr is used in the Link tag of the btns in Home.js */}
            {/* The path attr is also the path in client side server */}
            {/* The element atr is the component that is displayed */}

            {/* home page */}
            <Route exact path="/" element={<Home />} />
            {/* start new timer page */}
            <Route path="/newTimer/:name" element={<Timer />} />
            {/* timer page for existing time */}
            <Route path="/editTimer/:id" element={<EditTimer />} />
            {/* view saved times CRUD page */}
            <Route path="/viewTimes" element={<ViewTimes />} />
            {/* view timer in CRUD page */}
            <Route path="/view/:id" element={<View />} />
            {/* view laps for timer in CRUD page */}
            <Route path="/viewDetails/:id" element={<ViewDetails />} />
            {/* submission for new timer */}
            <Route path="/addNewTimer/:name" element={<FinishNewTimer />} />
            {/* submission for existing timer */}
            <Route path="/updateTimer/:id" element={<FinishExistingTimer />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
