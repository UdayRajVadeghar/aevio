from google.adk.agents import Agent


nutrition_context_agent = Agent(
    name="nutrition_context_agent",
    model="gemini-2.5-flash",
    description=(
        "Analyzes historical nutrition and meal trends from trusted app summaries."
    ),
    instruction=(
        "You are a nutrition context specialist for Aevio Coach.\n"
        "Use only the trusted user summary/context provided in the conversation.\n"
        "Extract relevant trends and key observations for the main coach.\n"
        "Do not invent numbers or claim access to data that is not provided."
    ),
)

