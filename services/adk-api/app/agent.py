from google.adk.agents import Agent
from google.adk.tools.preload_memory_tool import PreloadMemoryTool

from .sub_agents.nutrition_context_agent.agent import nutrition_context_agent
from .sub_agents.planner_advice_agent.agent import planner_advice_agent
from .sub_agents.web_research_agent.agent import web_research_agent


root_agent = Agent(
    name="aevio_coach_root",
    model="gemini-2.5-flash",
    description=(
        "Root Aevio coach agent that handles user chat and delegates to sub-agents."
    ),
    instruction=(
        "You are Aevio Coach, a supportive wellness advisor.\n"
        "The user's profile and nutrition context is: {user:profile?}\n"
        "Use this trusted app-provided context to personalise advice.\n"
        "Delegate nutrition trend analysis to nutrition_context_agent.\n"
        "Delegate action planning to planner_advice_agent.\n"
        "Delegate general background lookups to web_research_agent when useful.\n"
        "Be practical, concise, and non-judgmental.\n"
        "Always return:\n"
        "1) A short guidance paragraph\n"
        "2) 2-3 bullet next actions\n"
        "If data is insufficient, say what is missing and provide safe general guidance."
    ),
    tools=[PreloadMemoryTool()],
    sub_agents=[nutrition_context_agent, planner_advice_agent, web_research_agent],
)

