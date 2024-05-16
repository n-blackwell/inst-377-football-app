# inst-377-football-app
Repo for INST377 Group Project

# Project Title -
Soccer App

# Project Description -
Our project is focused on implementing a system that is designed to enable individuals to both effectively and 
efficiently track soccer-related content, such as their favorite soccer team, league, and players.

# Target Browsers Description - 
For our soccer app, our target browsers are open to iOS, Andriod, and Web browsers.

# Link to Developer Manual

**NEED TO ADD**

# Developer Manual for our Soccer App

In order to begin using our Soccer App, you have to install all our app and its dependencies.

## a. Installation:

1. You have to clone the repository from GitHub:
`git clone https://github.com/n-blackwell/inst-377-football-app.git`

2. Navigate to the project directory:
`cd inst-377-football-app`

3. Install dependencies using npm:
`npm install`

## b. Running Soccer App on a Server

4. Now, to run our Soccer App on a server, use these commands:
`npm start` **This will start the server and make the application accessible through a web browser.**

## c. Running Tests

5. To run tests for our Soccer App, use the following command:
`npm test` **This will run all the tests written for the software.**

## d. API Endpoints

6. Our Soccer App server provides the following API endpoints:

`GET /`: Retrieves home page.
`GET /Teams`: Retrieves a teams page.
`GET /Players:` Retrieves a player's page with player information.
`GET /About`: Retrieves about page.

Each endpoint performs the specified action related to soccer content management.

## e. Expectations on known Bugs and future development

7. Expectation for known bugs

Our app relies on external APIs to fetch data on teams and players. This API has limitations on number of requests allowed per dat.
API is limited in requests per day. After running out of request it may result in potential bugs or inconsistencies in the displayed content, particularly in charts.

When limit is exceeded, it is expected for users to experience errors and bugs.

8. Future Development Roadmap

Enhancing UI/UX for a better user experience.
Adding a live match update to scores, teams, standings, players, etc.
Integrating user authentication for personalized content.
Support additonal languages.