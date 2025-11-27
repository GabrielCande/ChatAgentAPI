class ChatApp {
  constructor() {
    this.chatMessages = document.getElementById("chatMessages");
    this.chatForm = document.getElementById("chatForm");
    this.messageInput = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendButton");
    this.clearButton = document.querySelector(".clear-button");

    this.isLoading = false;

    this.apiUrl = "http://localhost:8000/chat";

    this.init();
  }

  init() {
    this.bindEvents();
    this.messageInput.focus();
    this.loadChatHistory();
  }

  bindEvents() {
    this.chatForm.addEventListener("submit", (e) => this.handleSubmit(e));

    this.messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.chatForm.dispatchEvent(new Event("submit"));
      }
    });

    this.chatMessages.addEventListener("click", () => {
      this.messageInput.focus();
    });

    this.clearButton.addEventListener("click", () => this.clearHistory());
  }

  handleSubmit(e) {
    e.preventDefault();

    const message = this.messageInput.value.trim();
    if (message && !this.isLoading) {
      this.sendMessage(message);
    }
  }

  async sendMessage(message) {
    // Adiciona mensagem do usuário
    this.addMessage(message, true);

    // Limpa input
    this.messageInput.value = "";

    // Mostra indicador de digitação
    this.showTypingIndicator();

    // Desabilita envio
    this.setLoadingState(true);

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      this.hideTypingIndicator();
      this.addMessage(data.response, false);

      // Salva no histórico
      this.saveToHistory(message, data.response);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage(
        "Desculpe, ocorreu um erro. Verifique se a API está rodando na porta 8000.",
        false
      );
      console.error("Erro:", error);
    } finally {
      this.setLoadingState(false);
    }
  }

  addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;

    const time = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isUser) {
      // Mensagens do usuário em raw text
      messageDiv.textContent = text;
    } else {
      // Converte Markdown para HTML
      messageDiv.innerHTML = this.markdownToHtml(text);
    }

    const timeElement = document.createElement("div");
    timeElement.className = "message-time";
    timeElement.textContent = time;
    messageDiv.appendChild(timeElement);

    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  markdownToHtml(text) {
    if (!text) return "";

    // **negrito**
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // *itálico*
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // quebras de linha
    text = text.replace(/\n/g, "<br>");

    // listas
    text = text.replace(/^\s*\*\s+(.*)$/gm, "• $1");

    return text;
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "typing-indicator";
    typingDiv.id = "typingIndicator";
    typingDiv.textContent = "Pensando...";
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  setLoadingState(loading) {
    this.isLoading = loading;
    this.sendButton.disabled = loading;
    this.sendButton.textContent = loading ? "..." : "Enviar";
    this.messageInput.disabled = loading;
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  saveToHistory(userMessage, botResponse) {
    const history = this.getChatHistory();
    history.push({
      user: userMessage,
      bot: botResponse,
      timestamp: new Date().toISOString(),
    });

    // Mantém apenas as últimas 50 mensagens
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }

    localStorage.setItem("chatHistory", JSON.stringify(history));
  }

  getChatHistory() {
    return JSON.parse(localStorage.getItem("chatHistory") || "[]");
  }

  loadChatHistory() {
    const history = this.getChatHistory();

    // Se não há histórico, mantém apenas a mensagem de boas-vindas
    if (history.length === 0) return;

    // Limpa mensagens atuais (exceto boas-vindas)
    const welcomeMessage = this.chatMessages.querySelector(".bot-message");
    this.chatMessages.innerHTML = "";
    if (welcomeMessage) {
      this.chatMessages.appendChild(welcomeMessage);
    }

    // Carrega histórico
    history.forEach((entry) => {
      this.addMessage(entry.user, true);
      this.addMessage(entry.bot, false);
    });

    this.scrollToBottom();
  }

  clearHistory() {
    if (confirm("Tem certeza que deseja limpar o histórico do chat?")) {
      localStorage.removeItem("chatHistory");

      // Mantém apenas a mensagem de boas-vindas
      const welcomeMessage = this.chatMessages.querySelector(".bot-message");
      this.chatMessages.innerHTML = "";
      if (welcomeMessage) {
        this.chatMessages.appendChild(welcomeMessage);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ChatApp();
});
