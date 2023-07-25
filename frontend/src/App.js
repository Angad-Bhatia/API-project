// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/SpotIndex"
import SpotShow from "./components/SpotShow";
import CreateSpotForm from "./components/CreateSpotForm";
import SpotIndexUser from "./components/SpotIndexUser";
import UpdateSpotForm from "./components/UpdateSpotForm";
import ReviewsUserIndex from "./components/ReviewsUserIndex";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path="/">
            <SpotIndex/>
          </Route>
          <Route exact path="/spots/new">
            <CreateSpotForm/>
          </Route>
          <Route exact path="/spots/current">
            <SpotIndexUser/>
          </Route>
          <Route exact path ="/reviews/current">
            <ReviewsUserIndex/>
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <UpdateSpotForm/>
          </Route>
          <Route exact path="/spots/:spotId">
            <SpotShow/>
          </Route>
        </Switch>
      }
    </>
  );
}

export default App;
