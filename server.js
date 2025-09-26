const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());


// Função para salvar dados na planilha
function salvarNaPlanilha(dados) {
  let workbook, worksheet;

  if (fs.existsSync(FILE_PATH)) {
    workbook = XLSX.readFile(FILE_PATH);
    worksheet = workbook.Sheets[workbook.SheetNames[0]]; 
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Respostas");// Cria uma nova planilha se não existir
  }

  let registros = XLSX.utils.sheet_to_json(worksheet);// Lê os dados existentes
  registros.push(dados);
  
  const novoWorksheet = XLSX.utils.json_to_sheet(registros);// Atualiza a planilha com os novos dados
  workbook.Sheets[workbook.SheetNames[0]] = novoWorksheet;
  XLSX.writeFile(workbook, FILE_PATH);
}

// Arquivo da planilha
const FILE_PATH = "dados.xlsx";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "minha_senha_secreta";



// ✅ Verificação do Webhook (Meta chama quando configuramos)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verificado!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Recebimento de mensagens do WhatsApp
app.post("/webhook", (req, res) => {
  try {
    const entry = req.body.entry?.[0];// Acessa a primeira entrada
    const changes = entry?.changes?.[0];// Acessa a primeira mudança
    const messages = changes?.value?.messages;// Acessa as mensagens

    if (messages && messages.length > 0) {
      const msg = messages[0];// Acessa a primeira mensagem
      const from = msg.from; // número do usuário
      const text = msg.text?.body || "";// texto da mensagem

      console.log("Mensagem recebida de", from, ":", text);

      // Exemplo: usuário manda mensagem no formato "Nome: João; Produto: Camisa; Quantidade: 2"
      /*const partes = text.split(";");
      let dados = { Nome: "", Produto: "", Quantidade: "" };

      partes.forEach((parte) => {
        const [chave, valor] = parte.split(":").map((p) => p.trim());
        if (chave && valor) {
          if (chave.toLowerCase() === "nome") dados.Nome = valor;
          if (chave.toLowerCase() === "produto") dados.Produto = valor;
          if (chave.toLowerCase() === "quantidade") dados.Quantidade = valor;
        }
      });

      if (dados.Nome && dados.Produto && dados.Quantidade) {
        salvarNaPlanilha(dados);
        console.log("✅ Dados salvos na planilha:", dados);
      } else {
        console.log("⚠️ Mensagem recebida não está no formato esperado.");
      }*/
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
