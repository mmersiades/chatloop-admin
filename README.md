This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Running the app

`npm start`: Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Testing

## Unit tests

Unit tests are written in Jest with React Testing Library

`npm test`: Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

`npm test --coverage --watchAll=false`: Runs the tests suites and generates a coverage report, available in the the `/coverage` folder.

## End-to-end tests

End-to-end tests are written with Cypress.

They require the Chatloop monolithic api server to be runnin glocally with the `mockdata` profile active.

`npm run cypress:open`: Opens the Cypress test runner app.

`npm run cypress:all`: Runs all the test suites in the console. A coverage report is output in the `/coverage-cypress` folder.

## Combined test coverage

Test coverage can be calculated using both the unit and end-to-end tests combined.

`npm run test-coverage`: Runs the unit tests, then the end-to-end tests, then produces a combined coverage report, available in the `/coverage-combined` folder.

`open ./coverage-combined/lcov-report/index.html`: Opens the combined coverage report in the browser.

### Deployment
