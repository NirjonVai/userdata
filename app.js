const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GitHub repository and token configuration
const token = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';
const repoOwner = 'YOUR_GITHUB_USERNAME';
const repoName = 'YOUR_REPOSITORY_NAME';
const fileName = 'user_data.json'; // The file where user data will be stored

// GitHub API URL to create or update a file in the repository
const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;

// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/signup">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br><br>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>

      <input type="submit" value="Sign Up">
    </form>
  `);
});

// Handle the form submission
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  
  // Create user data object
  const userData = {
    username: username,
    email: email,
    password: password
  };

  // Convert the user data to base64 encoding (GitHub requires base64 for file content)
  const encodedData = Buffer.from(JSON.stringify(userData)).toString('base64');

  // GitHub API request to upload the data as a JSON file
  axios.put(url, {
    message: 'Add new user data',
    content: encodedData
  }, {
    headers: {
      'Authorization': `token ${token}`
    }
  })
  .then(response => {
    console.log('User data stored successfully!', response.data);
    res.send('<h1>Signup Successful! Your data has been stored in GitHub.</h1>');
  })
  .catch(error => {
    console.error('Error storing user data:', error);
    res.send('<h1>Error occurred while storing user data. Please try again.</h1>');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
