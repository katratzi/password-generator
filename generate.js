// for luck
console.log("hello world");

// now I know my abc's
const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbols = ["!", "@", "$", "%", "^", "&", "*", "(", ")", "?", "#", ";", "?", "+"];
const vowels = ["a", "e", "i", "o", "u"];
const nonVowels = letters.filter((letter) => !vowels.includes(letter));
const say = ["ch", "cl", "dd", "dr", "dy", "fh", "fr", "fy", "gh", "gy", "ky", "ll", "ly", "nt", "nd", "ng", "ny", "ph", "py", "rh", "rn", "rl", "rk", "sh", "st", "sy", "th", "ty", "ph", "vy", "xp", "yl", "yn", "yr", "zz", "zy"]


// we have different types of passwords.  a constant random string. a-snake-case-type. easy to say
let currentGen = "snake";
// options for characters
let useUppercase = true;
let useLowercase = true;
let useSymbols = false;
let useNumbers = false;

useSpecial = () => useSymbols || useNumbers;
useSpecialOnly = () => ((useSymbols || useNumbers) && (!useLowercase && !useUppercase));


// slider and it's value
var slider = document.getElementById("passwordLength");
var sliderText = document.getElementById("passwordLengthValue");
updateSliderText();

// regen at start
regenerate();

// Update the current slider value (each time you drag the slider handle)
// and also regenerate
slider.oninput = function () {
    regenerate();
}

// radio button for generator type clicked
function changeGen(radio) {

    // check if we have a change in generator type (can click same radio twice)
    if (currentGen !== radio.value) {

        // keep the slider from jumping about when using snake
        const normalValue = slider.value / slider.max;
        currentGen = radio.value;

        // change slider min/max based on gen type
        slider.max = currentGen === "snake" ? 5 : 32;
        slider.value = normalValue * slider.max;
        updateSliderText();
        updateCheckDisabled();
        // regen if we change type
        regenerate();
    }
}

function changeOpt(option) {

    // what are we toggling
    if (option.value === "lowercase") {
        useLowercase = option.checked;
    }
    else if (option.value === "uppercase") {
        useUppercase = option.checked;
    }
    else if (option.value === "symbols") {
        useSymbols = option.checked;
    }
    else if (option.value === "numbers") {
        useNumbers = option.checked;
    }

    regenerate();
}

// get a new random password
function regenerate() {

    let password = "";
    if (currentGen === "constant") {
        password = rengerateConstant();
    }
    else if (currentGen === "snake") {
        password = rengerateSnake();
    }
    else if (currentGen === "say") {
        password = rengerateSay();
    }

    // change in the password text 
    document.getElementById('password').innerText = password;
    updateSliderText();
    easterEgg();
}

// we ignore symbols and number on easy to say, so disable these to illustrate that
function updateCheckDisabled() {
    var numCheck = document.querySelector("input[type='checkbox'][value='numbers']");
    var symCheck = document.querySelector("input[type='checkbox'][value='symbols']");
    numCheck.disabled = currentGen === "say";
    symCheck.disabled = currentGen === "say";
}

// regen a constant string, no dashes
function rengerateConstant() {
    let random = "";

    for (let i = 0; i < slider.value; i++) {
        random += randomUserChar();
    }

    // modify final string upper/lower
    if (!useLowercase && useUppercase) { random = random.toUpperCase(); }
    if (useLowercase && useUppercase) { random = randomUppercase(random); }

    return random;
}

// regen a snake-case-password
function rengerateSnake() {
    let random = "";
    for (let i = 0; i < slider.value; i++) {
        for (let j = 0; j < 5; j++) {
            // ok, we'll allow symbols
            random += randomUserChar();
        }
        // hyphen seperators except at end
        if (i !== (slider.value - 1)) {
            random += '-';
        }
    }

    // modify final string upper/lower
    if (!useLowercase && useUppercase) { random = random.toUpperCase(); }
    if (useLowercase && useUppercase) { random = randomUppercase(random); }

    return random;
}

// regen a constant string, no dashes
function rengerateSay() {

    // usually don't start with vowel
    let useVowel = rollDice(3) === 0 ? true : false;
    let random = "";
    // flips between vowel and consonant...slightly higher chance of single consonant than double char
    for (let i = 0; random.length < slider.value; i++) {
        if (useVowel) {
            random += randomChar(vowels);
        } else {
            random += rollDice(3) === 0 ? randomChar(say) : randomChar(nonVowels);
        }
        useVowel = !useVowel;
    }
    // small chance that we can be too long from adding 2 chars at end
    random = random.substring(0, slider.value);
    // modify final string upper/lower
    if (!useLowercase && useUppercase) { random = random.toUpperCase(); }
    if (useLowercase && useUppercase) { random = randomUppercase(random); }

    return random;
}

// random char from the options set by the user
function randomUserChar() {
    let r = "";
    // what special chanacters might we use
    let tempSpecial = [];
    if (useSymbols) { tempSpecial = [...symbols]; }
    if (useNumbers) { tempSpecial = [...tempSpecial, ...numbers]; }

    if (useSpecialOnly())
        r = randomChar(tempSpecial);
    else if (useSpecial()) // 1 in 6 chance of special char
        r = rollDice(6) === 0 ? randomChar(tempSpecial) : randomChar(letters);
    else
        r = randomChar(letters);

    return r;
}

// random one of the given characters
function randomChar(chars) {
    var char = chars[rollDice(chars.length)];
    return char;
}

// random roll between 0 and sides
function rollDice(sides) {
    return Math.floor(Math.random() * sides);
}

// flip ramdonly to uppercase
function randomUppercase(chars) {
    let altered = "";
    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        // if we're a letter and small chance to be upper
        if (letters.includes(char) && rollDice(3) === 0) {
            char = char.toUpperCase();
        }
        altered += char;
    }
    return altered;
}

// show slider value with emoji for password length
function updateSliderText() {
    const passwordLength = document.getElementById('password').innerText.length;
    let emoji = '';
    if (passwordLength < 8) {
        emoji = '😖 bad'
    }
    else if (passwordLength < 12) {
        emoji = '😐 meh'
    }
    else if (passwordLength < 20) {
        emoji = '😌 yes'
    }
    else {
        emoji = '😎 rad'
    }

    // Display the default slider value
    sliderText.innerHTML = slider.value + " " + emoji;

}

function copyToClipboard() {
    // get text to be copied
    var text = document.getElementById('password').innerText;
    console.log(text);

    // need an input text to work with
    var tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand("copy");
    document.body.removeChild(tempInput);

    /* Alert the copied text */
    alert("Copied to clipboard: " + text);

}

function easterEgg() {
    if (!useLowercase && !useUppercase && !useSymbols && !useNumbers) {
        document.getElementById('password').innerText = "¯\\_(ツ)_/¯";
        sliderText.innerHTML = slider.value + ' 😵';
    }

}