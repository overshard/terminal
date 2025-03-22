const terminalElement = document.querySelector(".window__content");
let inputSpan = document.querySelector(".input");
let cursorSpan = document.querySelector(".cursor");

let bitcoin = 0;

// Define command functions
const help = () => {
  // Filter out hidden commands like "cheat"
  const visibleCommands = Object.keys(commands).filter(cmd => cmd !== "cheat");
  return `Available commands: ${visibleCommands.join(", ")}`;
};

const about = () => `
  A terminal written by Isaac Bythewood.
  Definitely no hidden games anywhere.
  `;

const date = () => new Date().toLocaleString();

const tick = () => "Tock.";

const ping = () => "Pong.";

const cheat = () => {
  bitcoin += 100;
  updateBitcoinDisplay();
  return `You now have ${bitcoin} bitcoin. Cheater.`;
};

const hack = () => {
  bitcoin += 1;

  // Create or update bitcoin display when we reach 10 or more bitcoin
  if (bitcoin >= 10) {
    updateBitcoinDisplay();
  }

  return `You now have ${bitcoin} bitcoin.`;
};

// Function to update the bitcoin display on the page
function updateBitcoinDisplay() {
  let bitcoinDisplay = document.querySelector(".bitcoin");
  if (!bitcoinDisplay) {
    bitcoinDisplay = document.createElement("div");
    bitcoinDisplay.className = "bitcoin";
    document.body.appendChild(bitcoinDisplay);
  }
  bitcoinDisplay.textContent = `${bitcoin.toLocaleString()} ฿`;
}

const shop = (args) => {
  // If no arguments provided, show the shop menu
  if (!args) {
    return `
  Shop:
  autohack - 10 bitcoin, automatically hacks for you

  Usage: shop [item]
  `;
  }

  // Handle purchasing items
  if (args === "autohack") {
    if (bitcoin >= 10) {
      bitcoin -= 10;
      // Set up an automatic hack every 5 seconds
      setInterval(() => { bitcoin += 1; updateBitcoinDisplay(); }, 500);
      return `You purchased autohack for 10 bitcoin. You now have ${bitcoin} bitcoin.`;
    } else {
      return `Not enough bitcoin. You need 10 bitcoin but only have ${bitcoin}.`;
    }
  }

  return `Unknown item: ${args}. Type 'shop' to see available items.`;
};

// Define available commands
const commands = {
  help: help,
  about: about,
  date: date,
  tick: tick,
  ping: ping,
  hack: hack,
  shop: shop,
  cheat: cheat,
};

// Function to scroll to the bottom of the terminal
function scrollToBottom() {
  terminalElement.scrollTo({
    top: terminalElement.scrollHeight,
    behavior: "smooth",
  });
}

// Add command history tracking
let commandHistory = [];
let historyIndex = -1;
let currentInput = '';

function processCommand(commandInput) {
  const trimmedInput = commandInput.trim();

  if (!trimmedInput) return inputSpan; // Skip empty commands

  // Add command to history
  commandHistory.push(trimmedInput);
  historyIndex = -1;
  currentInput = '';

  // Split input into command and arguments
  const parts = trimmedInput.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.length > 1 ? parts.slice(1).join(' ') : '';

  let output = "";

  if (commands.hasOwnProperty(command)) {
    // Call the command with arguments if it accepts them
    const commandFunction = commands[command];
    if (commandFunction.length > 0) {
      // Function accepts arguments
      output = commandFunction(args);
    } else {
      // Function doesn't accept arguments
      output = commandFunction();
    }
  } else {
    output = `Command not found: ${command}. Type 'help' to see available commands.`;
  }

  // Detach the cursor from the current line
  if (cursorSpan && cursorSpan.parentNode) {
    cursorSpan.parentNode.removeChild(cursorSpan);
  }

  // Replace current line content with the command
  const currentLine = inputSpan.parentElement;
  currentLine.textContent = `> ${trimmedInput}`;

  // Process multi-line output
  const outputLines = output.split('\n');
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
  } else if (event.key === "ArrowUp") {
    // Navigate up in command history
    if (historyIndex === -1) {
      // Save current input before navigating history
      currentInput = inputSpan.textContent;
    }

    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputSpan.textContent = commandHistory[commandHistory.length - 1 - historyIndex];
    }
  } else if (event.key === "ArrowDown") {
    // Navigate down in command history
    if (historyIndex > 0) {
      historyIndex--;
      inputSpan.textContent = commandHistory[commandHistory.length - 1 - historyIndex];
    } else if (historyIndex === 0) {
      // Return to current input when reaching the bottom of history
      historyIndex = -1;
      inputSpan.textContent = currentInput;
    }
  } else if (event.key.length === 1) {
    inputSpan.textContent += event.key;
  }
});

document.body.focus();
