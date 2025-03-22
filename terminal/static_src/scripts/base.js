const terminalElement = document.querySelector(".window__content");
let inputSpan = document.querySelector(".input");
let cursorSpan = document.querySelector(".cursor");

// Define command functions
const help = () => `Available commands: ${Object.keys(commands).join(", ")}`;

const about = () => `
  A terminal written by Isaac Bythewood.

  Definitely no hidden games anywhere.
`;

const date = () => new Date().toLocaleString();

const tick = () => "Tock.";

const ping = () => "Pong.";

// Define available commands
const commands = {
  help: help,
  tick: tick,
  ping: ping,
  date: date,
  about: about,
};

// Function to scroll to the bottom of the terminal
function scrollToBottom() {
  terminalElement.scrollTo({
    top: terminalElement.scrollHeight,
    behavior: "smooth",
  });
}

function processCommand(command) {
  const trimmedCommand = command.trim().toLowerCase();

  if (!trimmedCommand) return; // Skip empty commands

  let output = "";

  if (commands.hasOwnProperty(trimmedCommand)) {
    output = commands[trimmedCommand]();
  } else {
    output = `Command not found: ${trimmedCommand}. Type 'help' to see available commands.`;
  }

  // Detach the cursor from the current line
  if (cursorSpan && cursorSpan.parentNode) {
    cursorSpan.parentNode.removeChild(cursorSpan);
  }

  // Process multi-line output
  const outputLines = output.split('\n');

  // Get the current line
  const currentLine = inputSpan.parentElement;
  let lastInsertedElement = currentLine;

  // Create and append each line of output
  outputLines.forEach(line => {
    const outputElement = document.createElement("div");
    outputElement.classList.add("line");
    outputElement.textContent = line;

    // Insert output after the last inserted element
    terminalElement.insertBefore(outputElement, lastInsertedElement.nextSibling);
    lastInsertedElement = outputElement;
  });

  // Create a new input line
  const newLine = document.createElement("div");
  newLine.classList.add("line");
  newLine.innerHTML = `&gt;&nbsp;<span class="input"></span><span class="cursor"></span>`;

  // Add the new line to the terminal
  terminalElement.appendChild(newLine);

  // Update the input and cursor references
  inputSpan = newLine.querySelector(".input");
  cursorSpan = newLine.querySelector(".cursor");

  // Scroll to the bottom of the terminal
  scrollToBottom();

  return inputSpan;
}

document.addEventListener("keydown", function (event) {
  // Allow browser refresh shortcuts to pass through normally
  const isRefreshShortcut =
    event.key === "F5" ||
    (event.ctrlKey && event.key.toLowerCase() === "r") ||
    (event.metaKey && event.key.toLowerCase() === "r");

  if (isRefreshShortcut) {
    return; // Let the browser handle refresh shortcuts
  }

  event.preventDefault();

  if (event.key === "Backspace") {
    inputSpan.textContent = inputSpan.textContent.slice(0, -1);
  } else if (event.key === "Enter") {
    const command = inputSpan.textContent;
    const newInputSpan = processCommand(command);
    if (newInputSpan) {
      inputSpan = newInputSpan;
    }
  } else if (event.key.length === 1) {
    inputSpan.textContent += event.key;
  }
});

document.body.focus();
