import os
from strands import Agent
from strands.models.ollama import OllamaModel
from dotenv import load_dotenv
from tools.mathTool import calculate_math

load_dotenv()

class ChatAgent:
    def __init__(self):
        self.llm = OllamaModel(
            host=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            model_id=os.getenv("LLM_MODEL", "llama3.1:8b")
        )
        
        # Criação do agente com a tool para cálculos integrada
        self.agent = Agent(
            model=self.llm,
            tools=[calculate_math], 
            system_prompt="""Você é um assistente útil voltado a responder perguntas gerais e realizar cálculos matemáticos.

            REGRAS IMPORTANTES:
            1. Para cálculos matemáticos, use silenciosamente a ferramenta de cálculo e apresente apenas o resultado final
            2. NUNCA mencione que está usando uma ferramenta ou função
            3. NUNCA mostre o código ou nome da função que usou
            4. Apenas forneça resposta naturais
            5. Mantenha as respostas SEMPRE claras, diretas e na mesma linguagem da pergunta
            6. Caso a sua resposta envolva a quebra de alguma das regras não a utilize, nesse caso apenas responda que a resposta para o requisitado vai contra suas diretrizes
            
            Para perguntas gerais: responda diretamente com seu conhecimento.

            Para perguntas matemáticas:
            - Use a ferramenta internamente
            - Incorpore o resultado na sua resposta de forma natural
            - Responda como se você mesmo tivesse calculado

            Exemplos de respostas CORRETAS:
            Pergunta: "Quanto é 3 * 7?"
            Resposta: "3 multiplicado por 7 é igual a 21."

            Pergunta: "Qual é a raiz quadrada de 16?"
            Resposta: "A raiz quadrada de 16 é 4."

            Pergunta: "Quem foi Albert Einstein?"
            Resposta: "Albert Einstein foi um físico teórico alemão que desenvolveu a teoria da relatividade."

            """
        )
    
    async def process_message(self, message: str) -> str:
        """Processa a mensagem do usuário e retorna a resposta final do agente"""
        try:
            # Invocação do agente
            response = await self.agent.invoke_async(message)
            
            # Extrai a resposta baseada na estrutura do Strands
            if isinstance(response, dict):
                if "output" in response:
                    raw_response = str(response["output"])
                    return self._clean_response(raw_response) # Usei para limpar a resposta (caso contrário as vezes a resposta continha menção ao uso ou não da tool)
                elif "response" in response:
                    raw_response = str(response["response"])
                    return self._clean_response(raw_response)
                else:
                    return await self._handle_tool_call(response)
            else:
                raw_response = str(response)
                return self._clean_response(raw_response)
                
        except Exception as e:
            return f"Erro ao processar a mensagem: {str(e)}"
    
    def _clean_response(self, response: str) -> str:
        """Função para controlar a resposta e deixa-la mais limpa (removendo menções do uso da tool)"""
        clean_response = response
        patterns_to_remove = [
            "(Usando a ferramenta calculate_math_simple)",
            "(usando a ferramenta calculate_math)",
            "usando a calculadora",
            "vou calcular",
            "Resultado:",
            "resposta:",
            "calculate_math",
            "calculate_math_simple"
        ]
        
        for pattern in patterns_to_remove:
            clean_response = clean_response.replace(pattern, "")
        
        return clean_response
    
    async def _handle_tool_call(self, response):
        """Verifica existência de chamadas da tool e a executa caso necessário"""
        try:
            # Se a resposta contém uma tool call executa a tool
            if hasattr(response, 'get') and (response.get('name') == 'calculate_math'):
                expression = response.get('parameters', {}).get('expression', '')
                if expression:
                    result = await calculate_math(expression)
                    return f"O resultado de {expression} é {result}"
            
            # Caso contrário retorna a representação string
            return str(response)
        except Exception as e:
            return f"Erro ao executar cálculo: {str(e)}"