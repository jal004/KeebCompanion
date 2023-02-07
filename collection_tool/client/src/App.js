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

function App() {
  return (
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
  );
}

export default App;
