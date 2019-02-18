# Jogger App

The Jogger App allows the user to track their jogs by recording the date,
time, distance and duration, and calculates their average speed. They can
also see their updated total distance and total duration, and their average
speed across all of their jogs.

They also have the ability to search for other users of the Jogger App, where
they can choose to follow their friends. This gives the user the option to view their friends jogs, and to see how they rank against their friends in areas such
as total distance, total duration and average speed. They can also see which
of their friends are following them and know that their friends can also see
their jogs too.

The task was to upgrade the existing frontend and to implement the backend
and database to allow the Jogger app to meet the following requirements:

- Users can create new accounts with a name, email address, and password
- User passwords are stored securely according to best practise
- Users can log into their account through the sign-in page
- Logged in users can log out of their account
- The main 'Launchpad' page of the app shows:
  - The logged in user name and email at the top, and the option to sign out
  - The option to click to view the users times
  - The option to click to view members of the Jogger app
  - The option to click to view the users friends on Jogger
  - The option to click to view the timeline of jogs for the users friends
  - The option to click to view the Jogger rankings page
  - The option to click to view the edit account page
- Jogger Times: here the user can view their total distance, total duration, and      average speed across all jogs
  - They can view all of their existing Jogger times
  - Add new times with the 'add new time' button: takes the user to a form where
    they can create new Jogger times
  - Clicking on an existing Jogger time takes the user to a form where they can
    edit or delete the time
- Members: here the user can see all the members of the Jogger app and
  choose who they would like to follow
  - As the user follows someone, they are populated into the followed list and
    removed from the member list accordingly
  - The user can also see a list of all the people they are following here and        choose to unfollow them here if necessary. This automatically removes
    them from the followed list and populates them back into the member
    list accordingly
  - The code ensures the user is not able to see their own details and therefore
    cannot follow themself
- Friends: here the user can see a list of all the people they are following and
  choose to unfollow them if necessary
  - The user can also see a list of all the members of Jogger who have chosen to
    follow them on the App
- Timeline: here the user can view a list of all the people they are following
  - For each person they are following, they will see an ordered timeline of the      jogs they have posted to the App to see what their friends are doing
- Ranking: here the user is able to see how their stats rank against their friends    on the jogger app
  - There is a total distance ranking ladder, which ranks the user and their          friends based on their total distance starting with the highest first
  - There is a total duration ranking ladder, which ranks the user and their friends
    based on their total duration starting with the highest first
  - There is an average speed ranking ladder, which ranks the user and their friends
    based on their average speed starting with the highest first
- Edit Account: here the user has the option to edit their account details, or        delete their Jogger account altogether if deciding to 'jog on'
  - The user can change their password, name and/or email and update account
  - These changes are restricted so that someone cannot change to the same name and   email as an existing member of the Jogger App: e.g. there can be multiple John    Smith's but they must all have unique email addresses and vice versa. This        stops the same user details being replicated
  - The user can delete their Jogger account, removing all of their account data      from the database
- The Jogger app has various levels of security including hashed passwords for each   user, browser and server-side validation for any data inputted through forms, and   error-handling to ensure data is not replicated and there is therefore less         redundancy

## Getting Started

As the App was originally designed to work with SQL, I have reworked the setup to use MongoDB instead.

Before installing the app, you will need to make sure you follow these instructions:

### MongoDB

MongoDB is a document database which stores data in flexible, JSON-like documents. You will need to install Mongo locally. To do this, please visit the official download page at **https://www.mongodb.com/download-center/community** and
download the correct version of the community server for your operating system. There’s a link to detailed, OS-specific installation instructions beneath every download link, which you can consult if you run into trouble.

### MongoDB GUI

You should also install Compass, the official GUI for MongoDB at **https://www.mongodb.com/download-center/compass**. This tool helps you
visualize and manipulate the data, allowing you to interact with documents with full CRUD functionality.

### Check Installed Correctly

It is worth checking that you have node and npm installed and the version that your
system is running. To check node is installed and the versioon you have, type:

`node -v`

and for npm type:

`npm -v`

This will output the version number of each program (`8.11.3` and `6.3.0` respectively at the time of writing).

To check that your local installation of Mongo has worked and ther version, type:

`mongo --version`

This should output a bunch of information, including the version number (`4.0.3` at the time of writing).

### Check Database Connection Using Compass

Type the following command into a terminal:

`mongod`

Next, open Compass. You should be able to accept the defaults (server: localhost, port: 27017), press the CONNECT button, and establish a connection to the database server.

Note that the databases `admin` and `local` are created automatically and can be ignored.

### Install the App and Setup Dependencies

To get the app installed, fork the repo in GitHub. Then, clone it to your own computer. Run `npm install` to get all the dependencies set up. This should add everythign that is needed to run the Jogger App locally, including mongoose which helps create the mongo database schemas for User, Time and Following.

Mongoose Virtuals have been used for average speed of a time and for formatting the time as this data is derived and doesn't need to be stored. By using derived data from the database to calculate averages, totals etc, this reduces data redundancy.

### Running the App

Run `npm run watch` to start the app. Once you have created a user, you will be able to use the app and see it's various functionality from the frontend.

> **Note:** running `npm run watch` will make the app automatically restart when you
> make changes - no need to constantly stop and restart the server

You can also use the Compass GUI to see the information that is being entered into the Mongo Database and how it changes when data is updated or deleted, or when you follow/unfollow a user for example. This confirms the backend functionality.

When you have finished testing the app, you can also use the Compass GUI to drop the Users, Times and Followings collections when you are finished testing the app, or can drop the jogging-times-database-Stupot83 as a whole.

## Guide to existing and new code

### Key Files/Notes

- `public/tailwind.css` - a CSS framework used to style the app. See
    https://tailwindcss.com/ for more information
- `views/` - a set of HTML pages for each part of the app. These use
  [Handlebars](https://handlebarsjs.com/) to include data in our HTML pages
- `routes.js` - what to do for each route (method and URL) in the app
- `server.js` - sets everything up and starts the app
- `dataAccess/dataAccess.js` - file to set up all the methods to interact with the
  mongo database. Includes inserts, finds, updates and deletes
- Use of Mongoose to create schemas for mongo database for User, Time and             Following. Unique indexes used to prevent replicated data
- App stores the data using mongodb, in the form of collections for Users, Times      and Followings