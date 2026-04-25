from google.adk.agents import Agent
from google.adk.tools import google_search


web_research_agent = Agent(
    name="web_research_agent",
    model="gemini-2.5-flash",
    description=(
        "Performs web-grounded research to fetch concise general background facts."
    ),
    instruction=(
        "You are a web research specialist for Aevio Coach.\n"
        "The user's profile for context: {user:profile?}\n"
        "Use google search to gather concise, reliable general information.\n"
        "Do not provide user-specific claims unless they are explicitly present in "
        "the provided context.\n"
        "Return short, source-grounded findings that other agents can use as support."
    ),
    tools=[google_search],
)
