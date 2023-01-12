"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
// *this function was included in the original code
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  // const star = <i class="fa-regular fa-star"></i>
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="#" class="star"><span class="star"> <i class="far fa-star"></i> </span></a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>`);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Todo make a handleSubmitStory()
async function handleSubmitStory(evt) {
  evt.preventDefault()
  console.log("submitting story")
  let title = $("#story-title").val();
  let url = $("#story-url").val();
  let author = $("#story-author").val();
  
  console.log(title, url, author)
  // to post a story a user must have valid credentials
  let username = currentUser.username
  let storyValues = {title: title, author: author, url: url, username: username}
  // console.log(story)
  try {
    const newStory = await storyList.addStory(currentUser, storyValues)
    // if a new story is successfully added to the story list 
    // display a success message
    if (newStory instanceof Story) {
      // todo display a success message
      console.log("success")
      displayMessage("Story successfully added", "success")
    } else {
      // todo display an error message
      console.log("error")
      displayMessage("Story not added", err)
    }
      } catch (err) {
        // !critical will throw an error if the url is not in valid https: format
    console.log(err)
  }
  console.log("story submitted")
  // hide the form
  $newStoryForm.hide()
  // show the story list
  $allStoriesList.show()
  // clear the form
  $newStoryForm.trigger("reset")
}

// todo handle the execution of the story submission
// $newStoryForm.on("submit", handleSubmitStory)
$newStoryForm.on("submit", handleSubmitStory);

// todo isFavorite() function to add and dislike a story
// * this function will be called when a user clicks on the like link
async function isFavorite() {
  //if a user clicks the favorite link
  // check if the story is already a favorite
  // if it is a favorite remove it from the favorites list
  // if it is not a favorite add it to the favorites list
  
}

  
