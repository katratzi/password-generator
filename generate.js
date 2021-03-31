// for luck
console.log("hello world");

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

function randLetter() {
    var letter = letters[Math.floor(Math.random() * letters.length)];
    return letter
}

// get a new random password
function regenerate() {
    let random = "";
    let length = document.getElementById('passwordLength').value;
    for (let i = 0; i < length; i++) {
        random += randomChar();
    }
    // change in the password text 
    document.getElementById('password').innerText = random;
}

function randomChar() {
    var letter = letters[Math.floor(Math.random() * letters.length)];
    // we'll say a 1 in 3 chance of being uppercase
    if (Math.floor(Math.random() * 3) === 0) {
        letter = letter.toUpperCase();
    }

    return letter;
}