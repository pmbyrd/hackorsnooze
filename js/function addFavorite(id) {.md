function addFavorite(id) {
    var favorites = getFavorites();
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
}
//remove a favorite from local storage javascript
function removeFavorite(id) {
    var favorites = getFavorites();
    var index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
        console.log("Couldn't find " + id + " in favorites");
    }

    //update the UI to reflect the change in state of the favorite button

    //get the button that was clicked on and update it's state to reflect the change in state of the favorite button

    //get the button that was clicked on and update it's state to reflect the change in state of the favorite button

    //get the button that was clicked on and update it's state to reflect the change in state of the favorite button

    //get the button that was clicked on and update it's state to reflect the change in state of the favorite button

    //get the button that was clicked on and update it's state to reflect the change in state of the favorite button

    //get all buttons with class="favorite" and loop through them all updating their states based on whether or not they are a favorite or not