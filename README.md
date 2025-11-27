# Chat Agent API

Uma API inteligente de chat construída com **FastAPI** e **Strands Agents**, capaz de realizar **cálculos matemáticos** e responder a **perguntas gerais** utilizando modelos de linguagem local via **Ollama**.

## Sumário

- [Introdução](#introdução)
- [Requisitos](#requisitos)
- [Instruções de Execução](#instruções-de-execução)
- [Documentação](#documentação)
- [Licensa](#licença)

## Introdução

A API é capaz de:

- **Responder perguntas gerais** usando conhecimento do modelo de linguagem.
- **Realizar cálculos matemáticos** complexos através de _tools_ especializadas.
- **Decidir automaticamente** quando usar cálculos vs. conhecimento geral.
- **Executar localmente** sem dependência de serviços cloud.

# Requisitos

Esta seção detalha os requisitos de software, modelo de linguagem e hardware necessários para executar a Chat Agent API.

### Software Necessário

| Componente | Versão | Link                                                 |
| :--------- | :----- | :--------------------------------------------------- |
| **Python** | 3.10+  | [Download Python](https://www.python.org/downloads/) |
| **Ollama** | Latest | [Download Ollama](https://ollama.ai/download)        |

### Modelo de Linguagem

O projeto utiliza um modelo de linguagem local via Ollama:

| Modelo           | Tamanho | Download                  |
| :--------------- | :------ | :------------------------ |
| **Llama 3.1 8B** | ~4.7GB  | `ollama pull llama3.1:8b` |

### Hardware Recomendado

Para uma performance ideal, especialmente durante o carregamento do modelo:

- **RAM:** Mínimo 8GB, recomendado **16GB**.
- **GPU:** Opcional, mas **recomendada** para melhor performance.
- **Armazenamento:** 10GB livres.

# Instruções de Execução

Siga os passos abaixo para configurar e executar a Chat Agent API.

### 1. Clone do Repositório

Use o Git para clonar o projeto:

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/ChatAgentAPI.git](https://github.com/seu-usuario/ChatAgentAPI.git)

```

### 2. Instalação do Ollama

Baixe e execute o instalador em [ollama.ai/download](https://ollama.com/download).

Abra o prompt de comando (CMD) e realize o download do modelo llama3.1:8b:

```bash
# Utilize o comando pull
ollama pull llama3.1:8b

# Ou utilize o comando run que também irá realizar o download
ollama run llama3.1:8b

```

### 3. Configuração do Ambiente

No CMD navegue até a raiz do diretório onde foi clonado o repositório:

```bash
cd C:\Gabriel\Github\ChatAgentAPI # (apenas um exemplo de path)

```

Em seguida inicialize o ambiente:

```bash
# Cria o ambiente
python -m venv venv

# Ativa o ambiente
venv\Scripts\activate

```

Após a incialização do ambiente instale as bibliotecas necessárias:

```bash
# Dentro do ambiente ativo execute:
pip install -r requirements.txt

```

### 4. Início do Ollama

Abra um novo CMD para realizar a inicialização da execução do modelo llama3.1:8b instalado:
OBS.: 1. Esse CMD deverá continuar aberto, não o feche; 2. Caso o comando não funcione certifique-se de que o Ollama não está aberto ou em execução.

```bash
ollama serve

```

### 5. Execução da API

Volte para o CMD onde você está no ambiente criado dentro da raiz do diretório do repositório e execute os comandos:

```bash
# Para acessar a pasta src
cd src

# Para inicializar a API
python main.py

```

# Documentação

Links para as documentações:

| Recurso            | Documentação                                                                 |
| :----------------- | :--------------------------------------------------------------------------- |
| **Strands Agents** | [Documentação Oficial](https://strandsagents.com/latest/documentation/docs/) |
| **FastAPI**        | [FastAPI Docs](https://fastapi.tiangolo.com/)                                |
| **Ollama**         | [Ollama Docs](https://github.com/ollama/ollama)                              |
| **Llama 3.1**      | [Model Card](https://ollama.com/library/llama3.1)                            |
| **Uvicorn**        | [Uvicorn Docs](https://uvicorn.dev/)                                         |

Estrutura do projeto:

```bash
ChatAgentAPI/
├── 📁 src/
│   ├── main.py          # Aplicação FastAPI principal
│   ├── agent.py         # Agente de IA
│   └── 📁 tools/
│       └── mathTool.py  # Tool especializada em cálculos
├── requirements.txt     # Dependências do projeto
├── .env                 # Variáveis de ambiente
└── README.md

```

# Licença

Este projeto é open-source e está disponível sob a licença MIT.
