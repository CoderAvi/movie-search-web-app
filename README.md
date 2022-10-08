# Movies-Web-App Engine
## The Ultimate Search Engine for Movies.
### [Movie-search-web-app Live heroku link](https://moviesearchavi.herokuapp.com/)

Live App link:- https://moviesearchavi.herokuapp.com/


* Install Node.js and MongoDB in your machine.
* Install all the npm packages required from dependencies in package.json using
  ```sh
  npm install
  ```
* Set Environment Variables for API keys using 
  ```sh
  set TMDBAPIKEY="Your tmdb api key without quotes"
  set OMDBAPIKEY="Your omdb api key without quotes"
  ```
* Set Environemnt Variable for Database using 
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
![Screenshot 2022-07-12 at 1 40 48 AM](https://user-images.githubusercontent.com/63573996/178349941-55f22c5f-3ee5-41aa-b364-6ae58259fb16.png)

![Screenshot 2022-07-12 at 1 40 56 AM](https://user-images.githubusercontent.com/63573996/178349955-30506e85-d384-49ed-88f6-617d16aa9e57.png)

![Screenshot 2022-07-12 at 1 41 02 AM](https://user-images.githubusercontent.com/63573996/178349966-297eef92-f8a8-419e-b36f-ef3c1f01e8e6.png)
