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
  updateFavorites()
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

  // 
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
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
  updateFavoriteStories();
 
}

// todo handle the click of the star icon
/**
*@returns handles the click of the star icon
*Uses the user model to append the story to the user's favorites.
1. first when the star icon is clicked, the story id is retrieved from the data attribute.
2. the story is then retrieved from the story list.
3. the story is then added to a set using lodash to avoid duplicates.
4. the set is then converted to an array and stored in the local storage.
5. the user favorites array is then pushed to the user.favorites array.
6. the star icon is toggled to reflect the change in the user's favorites.
the user story favorites id is then used to check if the story is already in the user's favorites.
7. if the story is already favorited the star icon is set to tru in the local storage.
*/


// handle favorite story will be an async event that handles the clicking of the star icon
function handleFavoriteStory(evt) {
	console.debug("handleFavoriteStory", evt);
	console.log("inside the handleFavoriteStory")
	const favId = $(this).data("story-id")
	// todo filter over the story list to find the story that matches the id, if it does that will be pushed into the user's favorites array, call update favorites to handle the logic of adding to the local storage 
	const favStory = storyList.stories.find(story => story.storyId === favId)
	console.log("favStory", favStory)

	// updateFavorites()
	$(this).hasClass("far") ? $(this).toggleClass("far fas") : $(this).toggleClass("fas far");
	if ($(this).hasClass("far")) {
		console.log(`this has class far ====>>>>> story NOT in favorites`, favId)
		currentUser.favorites.push(favStory)
	}

	if ($(this).hasClass("fas")) {
		console.log(`this has class fas ====>>>>> story is IN favorites`, favId)
		currentUser.favorites.splice(currentUser.favorites.indexOf(favStory), 1)
	}
	// updateFavorites()
	console.table(currentUser.favorites)
	// return favStory
	// get the story id
}
console.trace(currentUser)
$allStoriesList.on("click", ".fa-star", handleFavoriteStory);


// *instead of multiple functions I will use one to handle the local storage update favorites can be called on page load and when a user favorites a story
// async function updateFavorites() {
// 	console.debug("updateFavorites");

// 	if (currentUser.favorites.length > localStorage.getItem("favorites").length) {
// 		console.log("the user has added a new favorite")
// 		localStorage.setItem("favorites", JSON.stringify(currentUser.favorites));
// 	}




