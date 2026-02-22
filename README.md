# Purchases Analyzer Code Exercise

## Problem Description

We need to analyze purchases by customers to see who is a frequent buyer within certain categories, and to see who might have made unexpected or suspicious purchases. The application consists of a React frontend and a NodeJS/GraphQL/MongoDB backend. The application works for the most part, but it is really slow.

Your main task is to modify the application (frontend and/or backend) to improve the perfomance. Run the application locally to see if you can identify some of the bottlenecks and fix them.

**Optional bonus tasks (if you have time/desire):**

1. The logic for detecting suspicious purchases is too simplistic, and doesn't provide any real value. Take a stab at modifying the algorithm (`./client/src/find-suspicious-purchases.js`) to make it more useful. A suspicious purchase would be one that is out of the ordinary for a given user's purchase history.
2. The table sorting is not fully implemented. Update the application so that we can sort on any of the table headers.
3. There is a lack of unit tests throughout the code base. Feel free to add some to improve the stability of the application.

If you have any questions about the code or the tasks we are asking you to complete, please let us know and we would be happy to answer them.

## Getting Started

Make sure you have the following installed before trying to run the applications:

* Docker Desktop
* NodeJS version 20

This is a monorepo which contains the code for both the backend (`./server`) and the frontend (`./client`). You will have to install the dependencies and run each app separately.

1. Open two terminals.
2. In one terminal, navigate to the server code: `cd server`
3. Install dependencies: `npm install`
4. Start the backend server: `make start` (this runs docker compose, which will start the app and the database)
5. In the other terminal, navigate to the client code: `cd client`
6. Install dependencies: `npm install`
7. Start the frontend server: `make start`

The backend server will be running on port 4000, while the frontend server will be running on port 3000.

Open your browser and navigate `http://localhost:3000` to view the application.

**NOTE**: The repos utilize ESLint and the included VS Code settings to format your code on save, according to a set of rules that we use. Don't get caught up on formatting if it's not a style you like, or if the automatic formatting isn't working for you. You will NOT get penalized for lint "errors".

## Dependencies

The frontend app uses the following:

* [React v18](https://react.dev/learn)
* [Apollo GraphQL React Client](https://www.apollographql.com/docs/react/)
* [Semantic UI React](https://react.semantic-ui.com/)

The backend app uses the following:

* [NodeJs v20](https://nodejs.org/docs/latest-v20.x/api/index.html)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server)
* [MongoDB v7](https://www.mongodb.com/docs/manual/tutorial/getting-started/)

Knowledge in all these technolgoies is not required. Just do your best with technologies you are familiar with. For example, if you've never worked with MongoDB before, but want to make a change to the query, feel free to just write pseudocode instead of getting hung up in the docs for MongoDB.

## Submission

The last step is to zip up the repository (exclude the `node_modules` and `.git` folders) with your changes and email the zip file back to us so that we can review your work.

*Please do not spend a lot of time on this. If you get stuck, just submit what you have, and describe what was giving you difficulty.*
