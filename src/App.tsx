import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { LoadingProvider } from "./context/LoadingProvider";
import "./styles/index.css";

const CharacterModel = lazy(
  () => import("./components/Character/CharacterModel")
);
const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoadingProvider>
              <Suspense fallback={null}>
                <MainContainer>
                  <Suspense fallback={null}>
                    <CharacterModel />
                  </Suspense>
                </MainContainer>
              </Suspense>
            </LoadingProvider>
          }
        />
        <Route
          path="/myworks"
          element={
            <Suspense
              fallback={
                <div style={{ padding: 40, color: "#c2a4ff" }}>Loading...</div>
              }
            >
              <MyWorks />
            </Suspense>
          }
        />
        <Route
          path="/play"
          element={
            <Suspense
              fallback={
                <div style={{ padding: 40, color: "#c2a4ff" }}>Loading...</div>
              }
            >
              <Play />
            </Suspense>
          }
        />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
