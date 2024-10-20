# Telecom Economics Simulator

This is a responsive single-page application that simulates telecom economics based on user-defined variables. The app allows users to input various parameters and generates a graph showing the total profit over time for both current and new values.

## Features

- Input fields for setting key variables:
  - Total number of users
  - Monthly churn rate
  - Monthly Average Revenue per User (ARPU)
  - Cost of acquisition of new users
  - Wanted growth rate of new users
- Automatic copying of values to a second set of input fields for comparison
- Default value of 2% for the "New Wanted Growth Rate of New Users (%)" field
- Graph generation showing total profit over time for both sets of values
- Responsive design for optimal viewing on various devices

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for graph visualization

## How to Use

1. Open the `index.html` file in a web browser.
2. Enter values in the "Current Values" input fields.
3. Modify the "New Values" input fields as desired. Note that the "New Wanted Growth Rate of New Users (%)" field is pre-filled with a default value of 2%.
4. Click the "Generate Graph" button to view the profit projection.

## Deployment

This app is designed to be easily hosted on GitHub Pages. To deploy:

1. Push the project to a GitHub repository.
2. Go to the repository settings on GitHub.
3. In the "Pages" section, select the main branch as the source.
4. The app will be available at `https://<username>.github.io/<repository-name>`.

## License

This project is open source and available under the [MIT License](LICENSE).
