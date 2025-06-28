API Used:

You used the Dog CEO’s Dog API, which is a free and open-source API providing random images of dogs or by breed.

Endpoint used:

https://dog.ceo/api/breeds/image/random

Response:

Returns a JSON object containing a link to a random dog image, like:

{
  "message": "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
  "status": "success"
}
💡 How the Website Works:

👨‍💻 Technologies:

HTML

CSS

JavaScript (for API call and DOM manipulation)


🌐 Functionality Flow:

1. HTML Structure:

A container with:

Heading (title of site)

Image placeholder (<img> tag with id dogImage)

A "Generate Dog" button




2. JavaScript Function:

When the button is clicked, it triggers a function (getDogImage()).

This function sends a GET request to https://dog.ceo/api/breeds/image/random using fetch().

It parses the JSON response, extracts the dog image URL from data.message, and updates the src attribute of the <img> tag to display the new image.



3. Live Dog Image Generation:

Every time the user clicks the button, a new dog image appears without refreshing the page.


