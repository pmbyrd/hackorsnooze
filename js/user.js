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
function handleSubmitStory(evt) {
	console.debug("handleSubmitStory", evt)

	let $favId = $(this).attr("data-story-id")
	let favStory = storyList.stories.find(story => story.storyId === $favId)
	let favStoryId = favStory.storyId
	// !pay attn to the order of intialization.
	// *it makes more sense to check if a story is already in the local storage
	// this should be checked globally
	// use the star icon to add the story to the user's favorites
	try {
	  if ($(this).hasClass("far")) {
		currentUser.favorites.push(favStory)
		console.log("added to favorites")
	  }
	} catch (err) {
	  console.error("story not added", err)
	}
	
	try {
	  if($(this).hasClass("fas")) {
		if (currentUser.favorites.includes(favStory)) {
		  currentUser.favorites.splice(currentUser.favorites.indexOf(favStory), 1)
		  console.log("removed from favorites")
		}
	  }
	} catch (err) {
	  console.error("story not removed", err)
	}
	console.table(currentUser.favorites)
	$(this).toggleClass("fas far")

}

//todo implement the event listener for the star icon 
$allStoriesList.on("click", ".fa-star", handleSubmitStory)


// todo check for favorited stories in the session storage
/**
 * 
 * @returns {Array} an array of story ids 
*/
function checkForFavoriteStories() {
	console.debug("checkForFavoriteStories")
	if (currentUser === null) return
	if (localStorage.getItem("favorites")) {
		let favorites = JSON.parse(localStorage.getItem("favorites"))
		let savedFavStories = favorites.map((story) => story.storyId)
		console.table(savedFavStories)
		return savedFavStories
	}
}

/**
 * @returns Updates the ui for the favorite stories.
 * Filters through the story list and checks if the story ids are in the local storage.
 * If the story ids are in the local storage, the star icon is updated.
**/
function updateFavoriteStories() {
	console.debug("updateFavoriteStories")
	try {
		// 1 get the story ids from the local storage
		let savedFavStories = checkForFavoriteStories()
		// 2 check if the story ids are in the story list
		let favStories = storyList.stories.filter((story) => savedFavStories.includes(story.storyId))
		// 3 if the story ids are in the story list, add the star icon to the story
		if (favStories.length > 0) {
			favStories.forEach((story) => {
				let $storyId = $(`[data-story-id="${story.storyId}"]`)
				$storyId.toggleClass("fas far")
			})
		}
    } catch (err) {
		console.error("error", err)
    } 
}

// !This is part of the user section of the ui logic will go here and not in stories.js which handles the api calls related to stories
// todo update the ui section for favorited stories displayFavorites()
function displayFavorites(evt) {
	// 1. hide the story list
	$allStoriesList.hide()
	// 2. use the generateStoriesMarkup function to generate the markup for the stories
	let favStories = currentUser.favorites
	let favStoriesMarkup = generateStoriesMarkup(favStories)
	// 3. append the markup to the story list
	$allStoriesList.append(favStoriesMarkup)
	$allStoriesList.show()
}




// TODO: update the nav link to listen for a a click on the favorites link


