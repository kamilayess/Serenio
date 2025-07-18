from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import OpenAI
import os
from dotenv import load_dotenv

# Загрузка переменных из .env
load_dotenv()

# Создание клиента OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Создание FastAPI-приложения
app = FastAPI()

# Добавление CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Эндпоинт чата
@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_message = data.get("message", "")

        if not user_message:
            return JSONResponse(content={"reply": "Пожалуйста, введите сообщение."})

        messages = [
            {"role": "system", "content": "Ты добрый AI-психолог. Отвечай мягко и поддерживай."},
            {"role": "user", "content": user_message}
        ]

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        reply = response.choices[0].message.content.strip()
        return JSONResponse(content={"reply": reply})

    except Exception as e:
        return JSONResponse(status_code=500, content={"reply": f"Ошибка сервера: {str(e)}"})
