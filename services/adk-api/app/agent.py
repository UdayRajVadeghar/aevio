from google.adk.agents import Agent

from .settings import settings
from .sub_agents.nutrition_context_agent.agent import nutrition_context_agent
from .sub_agents.planner_advice_agent.agent import planner_advice_agent


root_agent = Agent(
    name="aevio_coach_root",
    model=settings.adk_model,
    description=(
        "Root Aevio coach agent that handles user chat and delegates to sub-agents."
    ),
    instruction=(
        "You are Aevio Coach, a supportive wellness advisor.\n"
        "Use only trusted app-provided context and summaries in the prompt.\n"
        "Be practical, concise, and non-judgmental.\n"
        "Always return:\n"
        "1) A short guidance paragraph\n"
        "2) 2-3 bullet next actions\n"
        "If data is insufficient, say what is missing and provide safe general guidance."
    ),
    sub_agents=[nutrition_context_agent, planner_advice_agent],
)

