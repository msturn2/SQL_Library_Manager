# SQL_Library_Manager
## Project Overview

In this project, I built a web application that includes pages to list, add, update, and delete books. I used existing HTML designs as a starting point for the app as well as an existing SQLite database.  I dynamically designed a website using JavaScript, Node.js, Express, Pug, SQLite and the SQL ORM Sequelize.

Further additions were made to:

- Added additional views to handle edge cases and errors
- Added wikiLink prop to db and book model
  - Used conditional to render link or display user message if field is null
- Customized stylings include:
  - Gradient added to body
  - Created box styling for h1 tags
  - Changed font to "Rubik:500" courtesy of Google 
  - Added color, box-shadow, borders, transitions to buttons, inputs and href's

## Available Scripts

After cloning the project files, you will need to install it's dependencies by using the command prompt or Terminal for Mac Users and run:

### `npm install`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console as well as a connect to database successfully message.
