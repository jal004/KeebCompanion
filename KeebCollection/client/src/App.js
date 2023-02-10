import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AddEdit from "./pages/AddEdit";
import Home from "./pages/Home";
import View from "./pages/View";
import ViewType from "./pages/ViewType";
import ViewStatsType from "./pages/ViewStatsType";
import ViewPrice from "./pages/ViewPrice";
import ViewQuantity from "./pages/ViewQuantity";
import useLocalStorage from "use-local-storage";

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
    document.getElementById("logo").src = "/assets/logos/webapp_modo2.png";
  };

  return (
    <div data-theme={theme}>
      <img
        src="/assets/logos/webapp_default.png"
        alt="The KeebCompanion logo"
        id="logo"
      />
      <button class="btn" id="themeBtn" onClick={modoTheme}>
        Modern Dolch
      </button>
      <button class="btn" id="themeBtn" onClick={botanicalTheme}>
        Botanical
      </button>
      <button class="btn" id="themeBtn" onClick={nineKnineTheme}>
        9009
      </button>
      <button class="btn" id="themeBtn" onClick={darkTheme}>
        Dark
      </button>
      <button class="btn" id="themeBtn" onClick={lightTheme}>
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
            <Route exact path="/" element={<Home />} />
            <Route path="/addItem" element={<AddEdit />} />
            <Route path="/update/:id" element={<AddEdit />} />
            <Route path="/view/:id" element={<View />} />
            <Route path="/view/byType" element={<ViewType />} />
            <Route path="/view/statsByType" element={<ViewStatsType />} />
            <Route path="/view/byPrice" element={<ViewPrice />} />
            <Route path="/view/byQuantity" element={<ViewQuantity />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
