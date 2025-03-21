document.addEventListener("DOMContentLoaded", function () {
  const inputSpan = document.querySelector(".input");

  document.addEventListener("keydown", function (event) {
    if (
      event.key !== "F5" &&
      !(event.ctrlKey && event.key === "r") &&
      !(event.metaKey && event.key === "r")
    ) {
      event.preventDefault();
    }

    if (event.key === "Backspace") {
      inputSpan.textContent = inputSpan.textContent.slice(0, -1);
    } else if (event.key === "Enter") {
      inputSpan.textContent += "\n";
    } else if (event.key.length === 1) {
      inputSpan.textContent += event.key;
    }
  });

  document.body.focus();
});
