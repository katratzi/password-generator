// for luck
console.log("hello world");

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
let currentGen = "constant";

function randLetter() {
    var letter = letters[Math.floor(Math.random() * letters.length)];
    return letter
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
    let length = document.getElementById('passwordLength').value;
    for (let i = 0; i < length; i++) {
        random += randomChar();
    }
    return random;
}

// regen a snake-case-password
function rengerateSnake() {
    let random = "";
    let length = document.getElementById('passwordLength').value;
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < 5; j++) {
            random += randomChar();
        }
        // hyphen seperators
        if (i !== (length - 1)) {
            random += '-';
        }
    }
    // remove lost '-';
    return random;
}

function changeGen(radio) {

    // change in generator type
    if (currentGen !== radio.value) {
        console.log('Old value: ' + currentGen);
        console.log('New value: ' + radio.value);
        currentGen = radio.value;
        // regen if we change type
        regenerate();
    }
}

function randomChar() {
    var letter = letters[Math.floor(Math.random() * letters.length)];
    // we'll say a 1 in 3 chance of being uppercase
    if (Math.floor(Math.random() * 3) === 0) {
        letter = letter.toUpperCase();
    }

    return letter;
}