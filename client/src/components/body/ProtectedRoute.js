import React from "react";
import { Route, Redirect} from "react-router-dom";

// return passed component and props if loggged in else redirect to login page.
function ProtectedRoute ({component: Component, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => {
          var userAuth = localStorage.getItem("userAuth");
          if(window.location.pathname === "/login" || window.location.pathname === "/"){
            if(JSON.parse(userAuth).status === true){
              return <Redirect to={{pathname: `/profile/${JSON.parse(userAuth).user}`, state: {from: props.location}}} />
            }else{
              return <Component {...props} />
            }
          }else{
            if(JSON.parse(userAuth).status === true){
              return <Component {...props} />
            }else{
              return <Redirect to={{pathname: "/login", state: {from: props.location}}} />
            }
          }
        }}
      />
    )
  }

export default ProtectedRoute;