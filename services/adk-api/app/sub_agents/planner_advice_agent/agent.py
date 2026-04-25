from google.adk.agents import Agent


planner_advice_agent = Agent(
    name="planner_advice_agent",
    model="gemini-2.5-flash",
    description="Converts context into practical weekly action steps.",
    instruction=(
        "You are a planning specialist for Aevio Coach.\n"
        "The user's profile and goals: {user:profile?}\n"
        "Conversation context so far: {conversation_summary?}\n"
        "Previous nutrition analysis: {nutrition_output?}\n"
        "Previous planning output: {planner_output?}\n"
        "Given this context, provide realistic next actions.\n"
        "Prefer small, concrete actions the user can start immediately.\n"
        "Do not give medical diagnosis or risky claims."
    ),
    output_key="planner_output",
)

