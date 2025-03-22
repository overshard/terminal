document.addEventListener("DOMContentLoaded", function () {
  let inputSpan = document.querySelector(".input");
  const terminalElement = document.querySelector(".window__content");
  let cursorSpan = document.querySelector(".cursor");

  // Define function declarations
  const help = () => `Available commands: ${Object.keys(commands).join(", ")}`;

  const tick = () => "Tock.";

  const date = () => new Date().toLocaleString();

  // Define available commands
  const commands = {
    help: help,
    tick: tick,
    date: date,
  };
  // Function to scroll to the bottom of the terminal
  function scrollToBottom() {
    terminalElement.scrollTo({
      top: terminalElement.scrollHeight,
      behavior: "smooth",
    });
  }

  function processCommand(command) {
    const trimmedCommand = command.trim();

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

    // Create and append output element
    const outputElement = document.createElement("div");
    outputElement.classList.add("line");
    outputElement.textContent = output;

    // Get the current line
    const currentLine = inputSpan.parentElement;

    // Insert output after the current line
    if (currentLine.nextSibling) {
      terminalElement.insertBefore(outputElement, currentLine.nextSibling);
    } else {
      terminalElement.appendChild(outputElement);
    }

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
    if (
      event.key !== "F5" &&
      !(event.ctrlKey && event.key === "r") &&
      !(event.metaKey && event.key === "r") &&
      !(event.ctrlKey && event.shiftKey && event.key === "r") &&
      !(event.metaKey && event.shiftKey && event.key === "r")
    ) {
      event.preventDefault();
    }

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
});
