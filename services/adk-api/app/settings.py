from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    google_api_key: str
    adk_model: str = "gemini-2.5-flash"
    adk_system_prompt: str = (
        "You are Aevio Coach. Use only the provided user history summary and context. "
        "Give practical, concise wellness advice and include 2-3 next actions."
    )
    adk_max_tokens: int = 800
    adk_temperature: float = 0.3

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()

