// api/get-images.js
const fetch = require("node-fetch");

const publicKey = "58e4de85ed21217913e4";
const secretKey = "12bf19270e5981ee4e0e";
const apiUrl = "https://api.uploadcare.com/files/";

module.exports = async (req, res) => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Uploadcare.Simple ${publicKey}:${secretKey}`
      }
    });
    const data = await response.json();
    console.log("Imagens retornadas pela API:", data.results);
    res.status(200).json(data.results);
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    res.status(500).json({ error: "Erro ao buscar imagens" });
  }
};
