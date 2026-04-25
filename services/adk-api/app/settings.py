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
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_context_table: str = "coach_contexts"
    supabase_user_id_column: str = "user_id"
    supabase_history_summary_column: str = "history_summary"
    supabase_context_column: str = "context"
    supabase_updated_at_column: str = "updated_at"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()

