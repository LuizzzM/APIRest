import * as UC from 'https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-regular.min.js';
UC.defineComponents(UC);

async function fetchImages() {
  try {
    const response = await fetch("/api/get-images");
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const fileList = await response.json();
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    if (!Array.isArray(fileList) || fileList.length === 0) {
      gallery.innerHTML = "<p>Nenhuma imagem encontrada.</p>";
      return;
    }

    fileList.forEach(file => {
      if (file.is_image && file.original_file_url) {
        const img = document.createElement("img");
        img.src = file.original_file_url;
        img.alt = file.original_filename;
        img.style.maxWidth = "300px";

        img.onerror = function () {
          img.style.display = "none";
        };

        gallery.appendChild(img);
      }
    });
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchImages();

  const uploader = document.querySelector("uc-file-uploader-regular");
  uploader.addEventListener("uploadComplete", async (event) => {
    const fileUUID = event.detail.uuid;
    try {
      const response = await fetch("/api/get-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ file: fileUUID })
      });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      fetchImages();
    } catch (error) {
      console.error("Erro ao enviar arquivo para armazenamento:", error);
    }
  });
});
