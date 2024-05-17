import React from "react";
import "./AboutPage.css";

function AboutPage() {
    return (
        <div className="container">
            <h1>About Page</h1>
            <p>Welcome to the About page of our Football App project! Our app is designed to provide comprehensive information about football teams, players and matches.</p>
            <p>By using our football app you can:</p>
            <ul className="list">
                <li className="list-item">Learn detailed background information on teams and players in each league.</li>
                <li className="list-item">Keep up to date with game information and scores.</li>
                <li className="list-item">Follow your favorite teams and players to receive personalized updates.</li>
            </ul>
            <p>Our team members are dedicated individuals with a passion for football and technology. We work together to create immersive experiences for fans around the world.</p>
            <br />
            <br />
        </div>
    );
}

export default AboutPage;

