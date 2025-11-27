from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
from agent import ChatAgent

load_dotenv()

app = FastAPI(
    title="Chat Agent API",
    description="API de Chat com Agente de IA",
    version="1.0.0"
)

agent = ChatAgent()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"message": "API funcionando corretamente"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "chat-api"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint para enviar mensagens para o agente de IA
    """
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="A mensagem não pode estar vazia")
        
        response = await agent.process_message(request.message)
        return ChatResponse(response=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )