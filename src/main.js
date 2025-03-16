const rangeInput = document.getElementById("range-input");
const charCount = document.getElementById("char-count");
const errorMessage = document.getElementById("error-message");
const generateBtn = document.getElementById("generate-btn");
const generatedPassword = document.getElementById("generated-password");
const copyBtn = document.getElementById("copy-btn");
const copiedText = document.getElementById("copied-text");
const copySpan = document.getElementById("copy-span");
const copySVG = document.getElementById("copy-svg");
let sliderChanged = false;

rangeInput.addEventListener("input", () => {
  sliderChanged = true;
  charCount.textContent = rangeInput.value;
  const percentage =
    ((rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min)) *
    100;
  rangeInput.style.background = `linear-gradient(to right, #4ad85a ${percentage}%, #252429 ${percentage}%)`;
});

function generatePassword() {
  const charLength = parseInt(rangeInput.value, 10);
  const includeUppercase = document.getElementById("uppercase-letters").checked;
  const includeLowercase = document.getElementById("lowercase-letters").checked;
  const includeNumbers = document.getElementById("numbers").checked;
  const includeSymbols = document.getElementById("symbols").checked;

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let charSet = "";
  let password = "";

  if (includeUppercase) charSet += uppercaseChars;
  if (includeLowercase) charSet += lowercaseChars;
  if (includeNumbers) charSet += numberChars;
  if (includeSymbols) charSet += symbolChars;

  console.log("Character Set:", charSet);

  if (!charSet) {
    errorMessage.textContent = "Please select at least one character type";
    return;
  }

  if (!sliderChanged) {
    errorMessage.textContent = "Please select a character length using slider";
    return;
  }

  for (let i = 0; i < charLength; i++) {
    password += charSet[Math.floor(Math.random() * charSet.length)];
  }
  console.log("password:", password);
  evaluatePasswordStrength(
    charLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );
  return password;
}

generateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const finalPassword = generatePassword();

  if (finalPassword) {
    generatedPassword.textContent = finalPassword;
    errorMessage.textContent = "";
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard
    .writeText(generatedPassword.textContent)
    .then(() => {
      copySpan.style.display = "none";
      copySVG.style.display = "none";
      copiedText.style.display = "block";

      setTimeout(() => {
        copiedText.style.display = "none";
        copySpan.style.display = "block";
        copySVG.style.display = "block";
      }, 700);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
});

function evaluatePasswordStrength(
  passwordLength,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  let strengthScore = 0;

  if (includeUppercase) strengthScore += 2;
  if (includeLowercase) strengthScore++;
  if (includeNumbers) strengthScore += 2;
  if (includeSymbols) strengthScore += 3;
  strengthScore += Math.floor(passwordLength / 5);

  console.log(strengthScore);

  const strengthText = document.getElementById("strength-text");
  const bar1 = document.getElementById("bar1");
  const bar2 = document.getElementById("bar2");
  const bar3 = document.getElementById("bar3");
  const bar4 = document.getElementById("bar4");

  resetBarStyles();
  if (strengthScore <= 3) {
    strengthText.textContent = "TOO WEAK";
    updateBarStyle(bar1, "bg-red-500", "border-red-500");
  } else if (strengthScore <= 4) {
    strengthText.textContent = "WEAK";
    updateBarStyle(bar1, "bg-orange-500", "border-orange-500");
    updateBarStyle(bar2, "bg-orange-500", "border-orange-500");
  } else if (strengthScore <= 6) {
    strengthText.textContent = "MEDIUM";
    updateBarStyle(bar1, "bg-yellow-500", "border-yellow-500");
    updateBarStyle(bar2, "bg-yellow-500", "border-yellow-500");
    updateBarStyle(bar3, "bg-yellow-500", "border-yellow-500");
  } else {
    strengthText.textContent = "STRONG";
    updateBarStyle(bar1, "bg-green-500", "border-green-500");
    updateBarStyle(bar2, "bg-green-500", "border-green-500");
    updateBarStyle(bar3, "bg-green-500", "border-green-500");
    updateBarStyle(bar4, "bg-green-500", "border-green-500");
  }
}

function updateBarStyle(bar, backgroundColorClass, borderColorClass) {
  bar.classList.remove("bg-transparent", "border-stone-200");
  bar.classList.add(backgroundColorClass, borderColorClass);
}

function resetBarStyles() {
  [bar1, bar2, bar3, bar4].forEach((bar) => {
    bar.classList.remove(
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "border-red-500",
      "border-orange-500",
      "border-yellow-500",
      "border-green-500"
    );
    bar.classList.add("bg-transparent", "border-stone-200");
  });
}

function updateStrengthDynamically() {
  errorMessage.textContent = "";

  evaluatePasswordStrength(
    +rangeInput.value,
    document.getElementById("uppercase-letters").checked,
    document.getElementById("lowercase-letters").checked,
    document.getElementById("numbers").checked,
    document.getElementById("symbols").checked
  );
}

[rangeInput, ...document.querySelectorAll("input[type='checkbox']")].forEach(
  (input) => input.addEventListener("input", updateStrengthDynamically)
);
