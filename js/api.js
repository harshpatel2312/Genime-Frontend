document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const textarea = document.getElementById("promptBox");
  const imageContainer = document.getElementById("imageContainer");
  const generatedImage = document.getElementById("generatedImage");
  const generatingLabel = document.getElementById("generatingLabel");
  const loadingText = document.getElementById("loadingText");
  const waveFill = document.getElementById("waveFill");

  // ✅ FastAPI endpoint
  const BACKEND_URL = "http://127.0.0.1:8000/generate";

  generateBtn.addEventListener("click", async () => {
    const prompt = textarea.value.trim();
    if (!prompt) {
      alert("Please enter a prompt first.");
      return;
    }

    // Reset and show loading indicators
    generatingLabel.classList.remove("hidden");
    loadingText.classList.remove("hidden");
    imageContainer.classList.add("hidden");
    generatedImage.src = "";

    // Start wave animation
    waveFill.style.transition = "none";
    waveFill.style.width = "0%";
    void waveFill.offsetWidth; // reflow
    waveFill.style.transition = "width 4s linear";
    waveFill.style.width = "100%";

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, number_of_images: 1 }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success" && data.images?.length) {
        const base64Img = data.images[0];

        // ✅ Display base64 image directly
        generatedImage.src = "data:image/png;base64," + base64Img;
        imageContainer.classList.remove("hidden");

        // Optionally stop wave animation once done
        waveFill.style.transition = "width 0.5s ease";
        waveFill.style.width = "100%";

      } else {
        alert("Error generating image: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to backend. Make sure the server is running.");
    }
  });
});
