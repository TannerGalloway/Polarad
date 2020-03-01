import React from "react";
import "../../css/accountpage.css";
import Navbar from "../nav/navbar";
import Accountinfo from "../account/accountInfo";


function accountPage(){
    return(
        <>
            <Navbar/>
            <Accountinfo/>
        </>
    )
}

export default accountPage;