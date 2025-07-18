// Показываем чат при клике на вкладку Serenio
const serenioTab = document.getElementById("serenio-tab");
if (serenioTab) {
  serenioTab.addEventListener("click", () => {
    document.getElementById("chat").style.display = "block";
  });
}

// Обработка отправки сообщения
const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("user-input");
const chatWindow = document.getElementById("chat-window");

if (sendBtn && input && chatWindow) {
  sendBtn.addEventListener("click", async () => {
    const message = input.value.trim();
    console.log("Sending message:", message);
    if (!message) return;

    chatWindow.innerHTML += `<div><strong>Ты:</strong> ${message}</div>`;

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        chatWindow.innerHTML += `<div style="color:red;"><strong>Ошибка (не JSON):</strong> ${jsonErr}</div>`;
        return;
      }

      if (data.reply) {
        chatWindow.innerHTML += `<div><strong>SerenioAI:</strong> ${data.reply}</div>`;
      } else {
        chatWindow.innerHTML += `<div style="color:red;"><strong>Ошибка:</strong> Неверный ответ</div>`;
      }

    } catch (error) {
      chatWindow.innerHTML += `<div style="color:red;"><strong>Ошибка:</strong> ${error}</div>`;
    }

    input.value = "";
  });
}
