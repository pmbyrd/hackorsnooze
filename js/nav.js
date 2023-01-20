"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 * // !keep concerns seperate.  User stories.js for story related functions
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

// Todo add in a function for clicking on the hack or snooze logo
function navHackOrSnoozeClick(evt){
  console.debug("navHackOrSnoozeClick", evt);
  $loginForm.hide()
  $signupForm.hide()
  $favoritesList.hide()
  $ownStoriesList.hide()
  $newStoryForm.hide()
}

$("#nav-all").on("click", navHackOrSnoozeClick);

