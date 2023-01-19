"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;
/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */
// ! I added "favorites" and "ownStories" to the local storage 
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
    localStorage.setItem("favorites", '[]');
    localStorage.setItem("ownStories", '[]');
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

/******************************************************************************
 * TODO update these functions once the favorite stories are implemented
 * Story-Favorite related functions
 * - addStoryToUserFavorites
 * - removeStoryFromUserFavorites
 * - isStoryInUserFavorites
 * - putUserFavoritesOnPage
 * - putUserStoriesOnPage
 */

// todo add a story to the user's list of favorites
async function handleFavoriteStory(evt) {
  console.debug("addStoryToUserFavorites");
  const $starId = $(this).data("story-id");
  const stories = storyList.stories;

  $(this).hasClass("fa-star") ? $(this).toggleClass("far fas") : $(this).toggleClass("fas far");
  if ($(this).hasClass("fas")) {
    console.log("adding to favorites", $starId)
    if (!stories.includes($starId)) {
      console.log("adding to favorites", $starId)
      const story = stories.find(story => story.storyId === $starId)
      currentUser.favorites.push(story);
      localStorage.setItem("favorites", JSON.stringify(currentUser.favorites));
      console.table(currentUser.favorites)
    }
  }
  if ($(this).hasClass("far")) {
      console.log("removing from favorites", $starId)
      const story = stories.find(story => story.storyId === $starId)
      currentUser.favorites.splice(currentUser.favorites.indexOf(story), 1);
      localStorage.setItem("favorites", JSON.stringify(currentUser.favorites))
  }
}

// todo handle the click on the favorite star
$allStoriesList.on("click", ".fa-star", handleFavoriteStory)

async function checkForUserFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites) {
    currentUser.favorites = favorites;
    favorites.forEach(story => {
      $(`#star-${story.storyId}`).addClass("fas").removeClass("far");
    });
  }
  // Iterate through all the stories in the page
  $(".fa-star").each(function () {
    const $storyId = $(this).data("story-id");
    // if the story is not in the favorites list, remove the fas class
    if (!favorites.find(f => f.storyId === $storyId)) {
      $(this).removeClass("fas");
    }
  });
}