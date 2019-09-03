This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
In the project directory, you can run:
`npm start` STARTS THE WEBSITE IN LOCALHOST:3000 (for dev)
`npm run server` STARTS THE SERVER IN LOCALHOST:5000 (for dev)
`npm test`
`npm run build`

# TODO LIST:
`**In Order of Priority**`
Manager Demands:
1) add last modified date for every key result (DONE)
2) add the level of confidence (DONE)
3) quarter tab on the dashboard (DONE)
4) dispayl front end problem solveing (ON HOLD)
5) add erik team name (?)
6) system to put enphasys on what is outstanding/group by color/  by name (IN PROGRESS, the sorting is not done yet)
 
- *Add .env files instead of writing credentials and settings in the code*
- Add the option to edit created objectives
- MAJOR refactor of code into smaller and cleaner Components
- Change all instances of Key Objectives to Key Results (same for variables)
- Add PropTypes to Components

# DESIGN DOC:
- App:
	- Navbar:
		- Dashboard (display all of them):
			- Main Objectives + Key Results Card Display
		- My Objectives (display only the ones with the targeted owner):
			- Main Objectives + Key Results Card Display + Slider
			- Save Button
		- New Objectives:
			- New OKR Form
			- Submit button
		- Edit Objectives:
			- Main Objectives + Key Results Card Display + Delete Buttons
			- Save Button

## Components:
- Main Objective Card (data structure: id, quarter, name, supervisor, progress, description):
	- Key Results Cards (data structure: keyid, id, name, owner, goalnumber, confidence, progress, description):
		- Slider Edit
		- Delete Buttons
- New OKR Form:
	- Main Objective Form
	- Key Results Form

## Deployment: 
- Disable SSL: git config http.sslVerify false
- git pull
- Change domain from localhost to d1bapp1 in package.json, views, and sqlserver
- npm run build (The website is configured on IIS to look for the files in the build folder, IIS will now take care of things)
- Backend SQL Server:
	- Located in C:\Program Files\iisnode\www\okrtool\
	- Copy sqlserver.js to the location
	- Use npm install for the required modules if you added to new modules in the file
	- Rewrite rules for webconfig if necessary
	- The sqlserver RESTApis should be changed to /node/okrtool/api/{whatever}, and the GET/POST requests in the website should be changed to that also
	- IIS will then take care of serving the requests
I strongly recommend you to use .env to take care of that in the future, I ran out of time to do that.
