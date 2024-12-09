const imageInput = document.getElementById("imageInput");
const processButton = document.getElementById("processButton");
const resultCanvas = document.getElementById("resultCanvas");
const downloadLink = document.getElementById("downloadLink");
const ctx = resultCanvas.getContext("2d");

processButton.addEventListener("click", async () => {
    if (!imageInput.files.length) {
        alert("Please select an image!");
        return;
    }

    const file = imageInput.files[0];

    // Use remove.bg API to remove the background
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": "SXtmn9uEfX5H95oLo9C4TvSu" },
        body: formData,
    });

    if (!response.ok) {
        alert("Error removing background!");
        return;
    }

    const blob = await response.blob();
    const img = await createImageBitmap(blob);

    // Set canvas dimensions to be square
    const size = 500; // Output size for profile pictures (500x500 pixels)
    resultCanvas.width = size;
    resultCanvas.height = size;

    // Draw Syrian flag as the background
    const flag = new Image();
    flag.src = "syrian_flag.jpg"; // Replace with the path to your flag image
    flag.onload = () => {
        // Draw and center the flag
        ctx.drawImage(flag, 0, 0, size, size);

        // Add slight blur
        ctx.filter = "blur(6px)";
        ctx.drawImage(flag, 0, 0, size, size);

        // Overlay the processed image (cropped and centered)
        ctx.filter = "none";

        // Determine the cropping size
        const scale = Math.min(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;

        ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * scale, img.height * scale);

        // Enable the download button
        downloadLink.href = resultCanvas.toDataURL("image/png");
        downloadLink.style.display = "inline-block";
    };
});

function createImageBitmap(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}