import React from 'react';
import {BrowserRouter as Router,Redirect,Route, Switch} from 'react-router-dom';
import Users from "./user/pages/Users";
import NewPlaces from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import {AuthContext} from "./shared/contexts/auth-context";
import {useAuth} from "./shared/hooks/auth-hook";


function App() {


  const {token,login,logout,userId} = useAuth();
  
  let routes;
  if(token)
  {
     routes = (  <Switch>
      <Route path="/" exact>
          <Users/>
        </Route>
         <Route path="/:userId/places" exact>
          <UserPlaces/>
       </Route>
        <Route path="/places/new" exact>
      <NewPlaces/>
      </Route>
       <Route path="/places/:placeId" exact>
      <UpdatePlace />
      </Route>
    <Redirect to="/"/>
    </Switch>);
  }
  else
  {
    routes = (<Switch>
      <Route path="/" exact>
          <Users/>
        </Route>
         <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/auth" exact>
    <Auth/>
    </Route>
    <Redirect to="/auth"/>
    </Switch>);
  }
  
  return (
    <AuthContext.Provider value={{isLoggedIn:!!token,token:token,userId:userId,login:login,logout:logout}}>
      <div>
      <Router>
      <MainNavigation/>
      <main>
        {routes}
      </main>  
      </Router>
    </div>
    </AuthContext.Provider> 
  );
}

export default App;
