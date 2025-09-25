document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("promptBox");

  // Auto-expand textarea
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

    if (textarea.value.trim().length > 0) {
      textarea.classList.add("has-text");
    } else {
      textarea.classList.remove("has-text");
    }
  });
});
