// Set up some references to parts of our form.
const guessInput = document.querySelector('.form__text-input');

// We create two global variables for the first and second landmark options.
let firstLandmark, secondLandmark;

// This function reads the landmark datafile (landmarks.json) and prepares the
// first and second landmark for placement on the webpage. Because it's wrapped
// in parentheses like this, it'll run every time the page is loaded.
(async function getLandmarkData() {
  // Fetch the landmark information from the landmarks.json file and put it into 'data'.
  const response = await fetch('./landmarks.json');
  const data = await response.json();

  let firstLandmarkIndex, secondLandmarkIndex;

  // Choose a random landmark number for both the first and second options.
  firstLandmarkIndex = getRandomInt(0, data.length);
  secondLandmarkIndex = getRandomInt(0, data.length);

  // If we get end up with the same landmark for both options, try again.
  while (firstLandmarkIndex === secondLandmarkIndex) {
    secondLandmarkIndex = getRandomInt(0, data.length);
  }

  // Once we're happy with the numbers that we're chosen, load the landmark
  // data for each of the two options.
  firstLandmark = data[firstLandmarkIndex];
  secondLandmark = data[secondLandmarkIndex];

  // Call the renderLanmarks function to put the information on the webpage.
  renderLandmarks(firstLandmark, secondLandmark);
})();

// This function creates the HTML that we put onto the webpage to show the first
// and second landmark.
function renderLandmarks() {
  // We start by getting references to the divs where we'll add the landmark information.
  const option1 = document.querySelector('.option1');
  const option2 = document.querySelector('.option2');
  
  // Then, we construct the HTML that we'll insert into those divs for each of the two landmarks.
  const firstLandmarkHtml = `
    <div class="option__media">
      <img class="option__image" src="${firstLandmark.photo}" alt="${firstLandmark.attribution}: ${firstLandmark.photo_original}">
    </div>
    <p class="option__place-name">
      <a title="${firstLandmark.name} on Wikipedia" href="${firstLandmark.wikipedia}">${firstLandmark.name}</a>
    </p>
  `;
  const secondLandmarkHtml = `
    <div class="option__media">
      <img class="option__image" src="${secondLandmark.photo}" alt="${secondLandmark.attribution}: ${secondLandmark.photo_original}">
    </div>
    <p class="option__place-name">
      <a title="${secondLandmark.name} on Wikipedia" href="${secondLandmark.wikipedia}">${secondLandmark.name}</a>
    </p>
  `;
  
  // Finally, we inject the HTML we created above for each landmark.
  option1.innerHTML = firstLandmarkHtml;
  option2.innerHTML = secondLandmarkHtml;
}

// This function chooses a random integer between the 'min' and 'max' values that
// you give it, not including the 'max' value; so, if you set min = 0 and max = 4,
// you'll get back either 0, 1, 2, or 3, chosen randomly.
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// This function tests the user's guess to see how it compares to the actual number
// of pencils needed to draw a straight line between the two landmarks.
function testGuess() {
  // First, we check in case the user didn't put in a number and let them know.
  if (isNaN(guessInput.value)) {
    alert(`Whoops, '${guessInput.value}' is not a number! Try again.`);
    guessInput.value = '';
    return false;
  }
  
  // Otherwise, if it's an empty value, exit the function.
  if (guessInput.value.length === 0) { return false; }
  
  // Then, we calculate what the actual number of pencils would be, and let the user
  // know they did via an alert.
  else {
    // Some constants to for converting things.
    const milesPerPencil = 35;
    const metresPerMile = 1609.344;
    // Figure out the actual distance between the two landmarks.
    const actualDistanceInMetres = calculateDistance(firstLandmark, secondLandmark);
    // Figure out how many pencils it would take to draw a line over that distance,
    // and round up to the nearest integer.
    const actualPencils = Math.ceil(actualDistanceInMetres / metresPerMile / milesPerPencil);
    // Finally, fire an alert to let the user know how they did.
    alert(`You guessed ${guessInput.value} pencils to draw a line from ${firstLandmark.name} to ${secondLandmark.name}. It would take ${actualPencils}!`);
    return true;
  }
}

// This function, based on the article at https://www.movable-type.co.uk/scripts/latlong.html,
// calculates the distance (in metres) between two landmarks.
function calculateDistance(firstLandmark, secondLandmark) {
  var R = 6371e3; // radius of the earth in metres
  var φ1 = toRadians(firstLandmark.latitude);
  var φ2 = toRadians(secondLandmark.latitude);
  var Δφ = toRadians(secondLandmark.latitude-firstLandmark.latitude);
  var Δλ = toRadians(secondLandmark.longitude-firstLandmark.longitude);

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;

  return d;  // distance between the two landmarks in metres
};

// This is a helper function that's used in calculateDistance() to convert from
// degrees to radians.
function toRadians(degrees) {
  const TAU = 2 * Math.PI;
  return degrees * TAU / 360;
}