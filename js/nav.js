"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);
// add an event listener to the nav submit link
$body.on("click", "#nav-submit", navSubmitClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//Todo on the submit nav show the submit form and hide the other forms
function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}

// !keep concerns seperate.  User stories.js for story related functions


// Todo : Add a click handler to the "Favorites" link in the nav bar. When clicked, it should call a function called navFavoritesClick. This function should hide all page components, then call a function called putFavoritesOnPage. This function should be defined in the stories.js file.
