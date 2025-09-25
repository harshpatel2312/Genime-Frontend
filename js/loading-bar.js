document.addEventListener("DOMContentLoaded", () => {
  const waveFill = document.getElementById("waveFill");
  const generateBtn = document.getElementById("generateBtn");
  const generatingLabel = document.getElementById("generatingLabel");
  const loadingText = document.getElementById("loadingText");

  generateBtn.addEventListener("click", () => {
    // Show labels
    generatingLabel.classList.remove("hidden");
    loadingText.classList.remove("hidden");

    // Reset instantly
    waveFill.style.transition = "none";
    waveFill.style.width = "0%";

    // Trigger reflow so transition applies again
    void waveFill.offsetWidth;

    // Animate to full over 4s
    waveFill.style.transition = "width 4s linear";
    waveFill.style.width = "100%";
  });
});
