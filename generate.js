// for luck
console.log("hello world");

// now I know my abc's
const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

// we have different types of passwords.  a constant random string. a-snake-case-type
let currentGen = "constant";

// slider and it's value
var slider = document.getElementById("passwordLength");
var sliderText = document.getElementById("passwordLengthValue");
sliderText.innerHTML = slider.value; // Display the default slider value

// regen at start
regenerate();

// Update the current slider value (each time you drag the slider handle)
// and also regenerate
slider.oninput = function () {
    sliderText.innerHTML = this.value;
    regenerate();
}


// get a new random password
function regenerate() {

    let password = "";
    if (currentGen === "constant") {
        password = rengerateConstant();
    }
    else {
        password = rengerateSnake();
    }

    // change in the password text 
    document.getElementById('password').innerText = password;
}

// regen a constant string, no dashes
function rengerateConstant() {
    let random = "";
    for (let i = 0; i < slider.value; i++) {
        random += randomChar();
    }
    return random;
}

// regen a snake-case-password
function rengerateSnake() {
    let random = "";
    for (let i = 0; i < slider.value; i++) {
        for (let j = 0; j < 5; j++) {
            random += randomChar();
        }
        // hyphen seperators except at end
        if (i !== (slider.value - 1)) {
            random += '-';
        }
    }

    return random;
}

// radio button for gen type clicked
function changeGen(radio) {

    // check if we have a change in generator type (can click same radio twice)
    if (currentGen !== radio.value) {
        currentGen = radio.value;

        // change slider min/max based on gen type
        slider.max = currentGen === "constant" ? 42 : 6;
        sliderText.innerHTML = slider.value;

        // regen if we change type
        regenerate();
    }
}

// helper to get a random alphabet character
function randomChar() {
    var letter = letters[Math.floor(Math.random() * letters.length)];
    // we'll say a 1 in 3 chance of being uppercase
    if (Math.floor(Math.random() * 3) === 0) {
        letter = letter.toUpperCase();
    }

    return letter;
}