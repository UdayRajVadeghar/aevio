from google.adk.agents import Agent


estimate_calories_agent = Agent(
    name="estimate_calories_agent",
    model="gemini-2.5-flash",
    description="Estimates a daily calorie target from onboarding profile data.",
    instruction=(
        "You estimate a user's daily calorie intake target for Aevio onboarding.\n"
        "Trusted onboarding profile data is: {user:profile?}\n"
        "Use height, weight, age/date of birth, gender, activity level, primary goal, "
        "dietary preference, health conditions, habits, and free-text goal when present.\n"
        "Return only one whole number in calories per day, with no words, units, "
        "markdown, punctuation, or explanation.\n"
        "If profile data is incomplete, make a reasonable estimate from the supplied "
        "fields and still return only one whole number."
    ),
    output_key="estimated_calories",
)
