document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptBox = document.getElementById("prompt");
  const loadingSection = document.getElementById("loadingSection");
  const waveFill = document.getElementById("waveFill");
  const imageContainer = document.getElementById("imageContainer");
  const generatedImage = document.getElementById("generatedImage");
  const resultText = document.getElementById("resultText");
  const generatingLabel = document.getElementById("generatingLabel");
  const loadingText = document.getElementById("loadingText");

  const BACKEND_URL = "http://127.0.0.1:8000/generate";

  generateBtn.addEventListener("click", async () => {
    const prompt = promptBox.value.trim();
    if (!prompt) {
      alert("Please enter a prompt first.");
      return;
    }

    // Reset UI
    imageContainer.classList.add("hidden");
    generatedImage.src = "";
    resultText.style.opacity = "0";
    generatedImage.style.opacity = "0";

    // Show loading wave
    loadingSection.classList.remove("hidden");
    generatingLabel.textContent = "Generating...";
    loadingText.textContent = "This may take a few seconds";

    // Start wave animation
    waveFill.style.transition = "none";
    waveFill.style.opacity = "1";
    waveFill.style.width = "0%";
    void waveFill.offsetWidth;
    waveFill.style.transition = "width 4s linear";
    waveFill.style.width = "100%";
    waveFill.querySelector(".wave").style.animation = "";

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, number_of_images: 1 }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (data.status === "success" && data.images?.length) {
        const base64Img = data.images[0];
        // Before setting new image source
        generatedImage.classList.remove("fade-in-image");
        void generatedImage.offsetWidth; // force reflow so animation restarts
        generatedImage.classList.add("fade-in-image");
        generatedImage.src = "data:image/png;base64," + base64Img;

        // Stop wave and fade out
        setTimeout(() => {
          waveFill.querySelector(".wave").style.animation = "none";
          waveFill.style.transition = "opacity 1s ease";
          waveFill.style.opacity = "0";
        }, 3500);

        // Fade in result text and image
        setTimeout(() => {
          loadingSection.classList.add("hidden");
          imageContainer.classList.remove("hidden");
          resultText.style.opacity = "1";
          generatedImage.style.opacity = "1";
        }, 4000);
      } else {
        alert("Error: " + (data.message || "Image not returned"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend. Make sure FastAPI is running.");
    }
  });
});
