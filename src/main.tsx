import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import store from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {" "}
      <App />
    </BrowserRouter>
  </Provider>
);
