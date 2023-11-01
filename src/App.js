import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Message from "./components/message/Message";
import Verify from "./pages/Auth/Verify/Verify";
const Contest = React.lazy(() => import("./pages/Contest/Contest"));
const Login = React.lazy(() => import("./pages/Auth/Login/Login"));
const ContestPage = React.lazy(() =>
  import("./pages/Contest/ContestPage/ContestPage")
);
const ContestAdd = React.lazy(() =>
  import("./pages/Admin/Contest/ContestAdd/ContestAdd")
);

const serverRoute = "http://localhost:5000";
const clientRoute = "http://localhost:4000";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <React.Suspense fallback="">
              <Login serverRoute={serverRoute} clientRoute={clientRoute} />
            </React.Suspense>
          }
        />
        <Route
          path="/"
          element={<Home serverRoute={serverRoute} clientRoute={clientRoute} />}
        />

        <Route path="/message" element={<Message />} />
        <Route path="/verify" element={<Verify serverRoute={serverRoute} />} />
        <Route
          path="/experiments"
          element={
            <React.Suspense fallback="">
              <Contest serverRoute={serverRoute} />
            </React.Suspense>
          }
        />
        <Route
          path="/experiments/:contestId"
          element={
            <React.Suspense fallback="">
              <ContestPage serverRoute={serverRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/admin"
          element={
            <React.Suspense fallback="">
              <ContestAdd serverRoute={serverRoute} clientRoute={clientRoute} />
            </React.Suspense>
          }
        />

        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
