import React from "react";
import { Route, Redirect} from "react-router-dom";

// return passed component and props if loggged in else redirect to login page.
function ProtectedRoute ({component: Component, logininfo, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => { 
              if(props.match.path === "/login" || props.match.path === "/"){
                if(logininfo === undefined){
                  return <Component {...props} />
                }else{
                  if(logininfo.status === true){
                    return <Redirect to={{pathname: `/profile/${logininfo.user}`}} />
                }else{
                  return <Component {...props} />
                }
                }
            }else{
              if(logininfo.status === true){
                return <Component {...props} />
              }else{
                return <Redirect to={{pathname: "/login"}} />
              }
          }}}
      />
    )
  }

export default ProtectedRoute;