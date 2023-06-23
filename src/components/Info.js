import React from "react";
import NavBar from "./NavBar";

function Info() {
    return (
        <div className="InfoPage">
            <NavBar></NavBar>
            <div className="threecontainer">
            <div className="about-container">
                <div className="about-container title "><h3>About RxLookup</h3></div>
                <div className="about-container description">
                A user-friendly alternative to complex medical websites, providing a convenient resource for gaining basic knowledge about FDA-approved drugs.</div>
            </div>
            <div className="tech-container">
                <div className="tech-container title"><h3>Tech Stack & Data Sources</h3></div>
                <div className="tech-container description"> Integration of OpenAI API, RxNorm API, and Drug Interactions API to gather displayed drug information.
                This app was built with React.js, HTML, and CSS.</div>
            </div>
            <div className="disclaimer-container">
                    <div className="disclaimer-container title"><h3>DISCLAIMER</h3></div>
                    <div className="disclaimer-container description">The content on this website is neither exhaustive nor meant to replace professional medical advice. 
                    It is always recommended to consult with a healthcare professional or refer to official sources for accurate and comprehensive drug information.</div>
            </div>
            </div>
        </div>
    )
}

export default Info;