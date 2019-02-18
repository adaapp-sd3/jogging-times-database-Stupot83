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

To get the app installed, fork the repo in GitHub. Then, clone it to your own computer. Run `npm install` to get all the dependencies set up. Run `npm run watch` to start the app.

> **Note:** running `npm run watch` will make the app automatically restart when you
> make changes - no need to constantly stop and restart the server

## Guide to existing code

### Key Files

- `public/tailwind.css` - a CSS framework used to style the app. See
    https://tailwindcss.com/ for more information.
- `views/` - a set of HTML pages for each part of the app. These use
  [Handlebars](https://handlebarsjs.com/) to include data in our HTML pages
- `routes.js` - what to do for each route (method and URL) in the app
- `server.js` - sets everything up and starts the app