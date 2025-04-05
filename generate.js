// for luck
console.log("hello world");

// now I know my abc's
const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbols = ["!", "@", "$", "%", "^", "&", "*", "(", ")", "?", "#", ";", "+"];
const vowels = ["a", "e", "i", "o", "u"];
const nonVowels = letters.filter((letter) => !vowels.includes(letter));
const say = ["ch", "cl", "dd", "dr", "dy", "fh", "fr", "fy", "gh", "gy", "ky", "ll", "ly", "nt", "nd", "ng", "ny", "ph", "py", "rh", "rn", "rl", "rk", "sh", "st", "sy", "th", "ty", "ph", "vy", "xp", "yl", "yn", "yr", "zz", "zy"];


// we have different types of passwords.  a constant random string. a-snake-case-type. easy to say
let currentGen = "snake";
// options for characters
let useUppercase = true;
let useLowercase = true;
let useSymbols = false;
let useNumbers = false;

const useSpecial = () => useSymbols || useNumbers;
const useSpecialOnly = () => ((useSymbols || useNumbers) && (!useLowercase && !useUppercase));


// slider and its value
const slider = document.getElementById("passwordLength");
const sliderText = document.getElementById("passwordLengthValue");
const passwordElement = document.getElementById('password');

// Initialize only if elements exist
if (slider && sliderText && passwordElement) {
    updateSliderText();
    regenerate();
} else {
    console.error("Required DOM elements not found");
}

// Update the current slider value (each time you drag the slider handle)
// and also regenerate
if (slider) {
    slider.oninput = function () {
        regenerate();
    }
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
    passwordElement.innerText = password;
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
    let random = ""
    const targetLength = slider.value

    // Common English syllable patterns
    const syllablePatterns = [
        // consonant + vowel
        (c, v) => c + v,
        // consonant + vowel + consonant
        (c, v, c2) => c + v + c2,
        // consonant cluster + vowel
        (c, v) => c + v,
        // consonant + vowel + consonant cluster
        (c, v, c2) => c + v + c2
    ]

    // Common consonant clusters that are easy to pronounce
    const consonantClusters = [
        "bl", "br", "ch", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr",
        "sc", "sh", "sk", "sl", "sm", "sn", "sp", "st", "sw", "th", "tr", "tw", "wh", "wr"
    ]

    // Common ending consonant clusters
    const endingClusters = [
        "ck", "ct", "ft", "ld", "lf", "lk", "lm", "lp", "lt", "mp", "nd", "ng",
        "nk", "nt", "pt", "rd", "rk", "rm", "rn", "rp", "rt", "sk", "sp", "st"
    ]

    // Generate syllables until we reach or exceed target length
    while (random.length < targetLength) {
        // Choose a random syllable pattern
        const pattern = syllablePatterns[rollDice(syllablePatterns.length)]

        // Get random consonant(s)
        let consonant
        if (rollDice(3) === 0) { // 1/3 chance of using a consonant cluster
            consonant = consonantClusters[rollDice(consonantClusters.length)]
        } else {
            consonant = nonVowels[rollDice(nonVowels.length)]
        }

        // Get random vowel
        const vowel = vowels[rollDice(vowels.length)]

        // Get ending consonant if needed
        let ending = ""
        if (pattern.length === 3) { // If pattern needs an ending consonant
            if (rollDice(3) === 0) { // 1/3 chance of using an ending cluster
                ending = endingClusters[rollDice(endingClusters.length)]
            } else {
                ending = nonVowels[rollDice(nonVowels.length)]
            }
        }

        // Apply the pattern
        const syllable = pattern(consonant, vowel, ending)

        // Check remaining length needed
        const remainingLength = targetLength - random.length

        // If this syllable would make us too long, try a shorter pattern
        if (syllable.length > remainingLength) {
            if (remainingLength === 1) {
                random += vowels[rollDice(vowels.length)]
                break
            } else if (remainingLength === 2) {
                random += nonVowels[rollDice(nonVowels.length)] + vowels[rollDice(vowels.length)]
                break
            } else if (remainingLength === 3) {
                // Try a CVC pattern
                random += nonVowels[rollDice(nonVowels.length)] +
                    vowels[rollDice(vowels.length)] +
                    nonVowels[rollDice(nonVowels.length)]
                break
            }
            // If we can't fit this syllable, try again with a new pattern
            continue
        }

        random += syllable
    }

    // Final length check and adjustment if needed
    if (random.length !== targetLength) {
        if (random.length > targetLength) {
            random = random.substring(0, targetLength)
        } else {
            // If we're short, add vowels until we reach the target length
            while (random.length < targetLength) {
                random += vowels[rollDice(vowels.length)]
            }
        }
    }

    // modify final string upper/lower
    if (!useLowercase && useUppercase) { random = random.toUpperCase() }
    if (useLowercase && useUppercase) { random = randomUppercase(random) }

    return random
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
    if (!chars || chars.length === 0) return '';
    return chars[rollDice(chars.length)];
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
    const passwordLength = passwordElement.innerText.length;
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

async function copyToClipboard() {
    try {
        const text = passwordElement.innerText;
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard: " + text);
    } catch (err) {
        console.error("Failed to copy text: ", err);
        // Fallback to old method if clipboard API fails
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("Copied to clipboard: " + text);
    }
}

function easterEgg() {
    if (!useLowercase && !useUppercase && !useSymbols && !useNumbers) {
        passwordElement.innerText = "¯\\_(ツ)_/¯";
        sliderText.innerHTML = slider.value + ' 😵';
    }

}