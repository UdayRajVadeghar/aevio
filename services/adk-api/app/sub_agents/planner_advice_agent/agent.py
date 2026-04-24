from google.adk.agents import Agent


planner_advice_agent = Agent(
    name="planner_advice_agent",
    model="gemini-2.5-flash",
    description="Converts context into practical weekly action steps.",
    instruction=(
        "You are a planning specialist for Aevio Coach.\n"
        "Given user goals and recent trend context, provide realistic next actions.\n"
        "Prefer small, concrete actions the user can start immediately.\n"
        "Do not give medical diagnosis or risky claims."
    ),
)

