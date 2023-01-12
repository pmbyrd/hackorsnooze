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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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

// todo make a function to add and dislike a story
// * this function will be called when a user clicks on the favorite icon
// *for all stories add a favorite icon
async function handleFavoriteStory(evt) {
  // get the element where where each story is being displayed
  // print each story to the console
}
// for each story map over the story list and print the story to the console
async function displayLike() {
  console.log("displaying like")
  // get the story id
  let storyId = $(this).closest("li").attr("id")
  // get the story from the story list
  let story = storyList.stories.find(story => story.storyId === storyId)
  // get the story's like count
  let likeCount = story.likes
  // get the story's dislike count
  let dislikeCount = story.dislikes
  // get the story's favorite count
  let favoriteCount = story.favorites
  // get the story's user
  let user = story.username
  // get the story's author
  let author = story.author
  // get the story's title
  let title = story.title
  // get the story's url
  let url = story.url
  // get the story's host name
  let hostName = story.getHostName()
  // get the story's user
  let username = story.username
  // get the story's date
  let date = story.createdAt
  // get the story's update date
  let updateDate = story.updatedAt
  // get the story's id
  let id = story.storyId
  // get the story's favorite status
  let favoriteStatus = story.isFavorite

  }
  // todo make a function isFavorite()
  
  // 

// if the document is ready console.log the story list
$(document).ready(function () {

  let $allStoriesList = $(".all-stories-list");
  console.log($allStoriesList)
  console.table($allStoriesList)
  console.log(storyList)
  console.log($(".story-link"))
})