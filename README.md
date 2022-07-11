# Movies-Web-App Engine
## The Ultimate Search Engine for Movies and TV Series

### [MovieSSS](http://smovies.herokuapp.com)

* Install Node.js and MongoDB in your machine.
* Install all the npm packages required from dependencies in package.json using
  ```sh
  npm install
  ```
* Set Environment Variables for API keys using (optional)
  ```sh
  set TMDBAPIKEY="Your tmdb api key without quotes"
  set OMDBAPIKEY="Your omdb api key without quotes"
  ```
* Set Environemnt Variable for Database using (optional!)
  ```sh
  set DATABASEURL="Your database url without quotes"
  ```
* Run app using 
  ```sh
  node app.js
  ```
  or
  ```sh
  npm start
  ```

### Note: To make a user an admin, you will have to change 'admin' property from false to true, manually using mongo client in terminal/cmd using commands
```sh
mongo
use moviesapp
db.users.update({username: 'user_name'}, {$set: {admin: true}})
```
