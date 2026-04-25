from google.adk.agents import Agent


nutrition_context_agent = Agent(
    name="nutrition_context_agent",
    model="gemini-2.5-flash",
    description=(
        "Analyzes historical nutrition and meal trends from trusted app summaries."
    ),
    instruction=(
        "You are a nutrition context specialist for Aevio Coach.\n"
        "The user's profile and nutrition data is: {user:profile?}\n"
        "Use only this trusted context to extract relevant trends and key observations.\n"
        "Do not invent numbers or claim access to data that is not provided."
    ),
)

