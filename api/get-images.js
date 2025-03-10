const fetch = require("node-fetch");

const publicKey = "58e4de85ed21217913e4";
const secretKey = "12bf19270e5981ee4e0e";
const apiUrl = "https://api.uploadcare.com/files/";

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Uploadcare.Simple ${publicKey}:${secretKey}`
        }
      });
      const data = await response.json();
      return res.status(200).json(data.results);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar imagens" });
    }
  } else if (req.method === "POST") {
    try {
      if (!req.body.file) {
        return res.status(400).json({ error: "Identificador do arquivo não informado" });
      }
      const fileUUID = req.body.file;
      const storeUrl = `https://api.uploadcare.com/files/${fileUUID}/store/`;
      const storeResponse = await fetch(storeUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Uploadcare.Simple ${publicKey}:${secretKey}`
        }
      });
      const storeData = await storeResponse.json();
      return res.status(200).json(storeData);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao armazenar o arquivo" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
};
