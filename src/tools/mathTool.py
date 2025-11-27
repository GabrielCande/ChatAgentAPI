from strands_tools.calculator import calculator

# Transformei a tool calculator em uma função assíncrona
async def calculate_math(expression: str, mode: str = "evaluate", precision: int = 10, scientific: bool = True):
    """
    Avalia expressões matemáticas usando a tool calculator.
    
    Args:
        expression: Expressão matemática (default: str)
        mode: Modo de operação (default: "evaluate")
        precision: Precisão decimal (default: 10)
        scientific: Notação científica (default: True)
    """
    try:
        result = calculator(expression=expression, mode=mode, precision=precision, scientific=scientific)
        return str(result)
    except Exception as e:
        return f"Erro no cálculo: {str(e)}"