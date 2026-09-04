import json
from pathlib import Path
from datetime import datetime

from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

BASE_DIR = Path(__file__).parent
PROMPTS_DIR = BASE_DIR / "prompts"
MEMORY_DIR = BASE_DIR / "memory"

PERSONA_FILE = PROMPTS_DIR / "mentor_persona.md"
HISTORY_FILE = MEMORY_DIR / "history.json"
PROFILE_FILE = MEMORY_DIR / "business_profile.json"
GROWTH_LOG_FILE = MEMORY_DIR / "growth_log.json"

# Ganti sesuai model terbaru yang mau kamu pakai
MODEL = "claude-sonnet-5"
MAX_TOKENS = 2048


class MentorAgent:
    def __init__(self):
        # Anthropic() otomatis baca ANTHROPIC_API_KEY dari environment (.env)
        self.client = Anthropic()
        self.persona = self._load_text(PERSONA_FILE)
        self.history = self._load_json(HISTORY_FILE, default=[])
        self.business_profile = self._load_json(PROFILE_FILE, default={})
        self.growth_log = self._load_json(GROWTH_LOG_FILE, default=[])

    # ---------- loading helpers ----------
    def _load_text(self, path: Path) -> str:
        if not path.exists():
            return ""
        return path.read_text(encoding="utf-8")

    def _load_json(self, path: Path, default):
        if not path.exists():
            return default
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _save_json(self, path: Path, data):
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    # ---------- context building ----------
    def build_system_prompt(self) -> str:
        """Gabungkan persona inti + konteks ide bisnis + catatan self-reflection."""
        parts = [self.persona]

        if self.business_profile:
            parts.append(
                "\n\n## Konteks ide bisnis (business_profile.json)\n"
                f"{json.dumps(self.business_profile, ensure_ascii=False, indent=2)}"
            )

        if self.growth_log:
            # batasi jumlah catatan lama yang dimuat biar konteks nggak membengkak
            recent_notes = self.growth_log[-10:]
            parts.append(
                "\n\n## Catatan self-reflection dari sesi sebelumnya\n"
                f"{json.dumps(recent_notes, ensure_ascii=False, indent=2)}"
            )

        return "\n".join(parts)

    # ---------- main chat ----------
    def send_message(self, user_input: str) -> str:
        self.history.append({"role": "user", "content": user_input})

        response = self.client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=self.build_system_prompt(),
            messages=self.history,
        )

        reply_text = "".join(
            block.text for block in response.content if block.type == "text"
        )

        self.history.append({"role": "assistant", "content": reply_text})
        return reply_text

    # ---------- persistence ----------
    def save_session(self):
        self._save_json(HISTORY_FILE, self.history)
        self._save_json(PROFILE_FILE, self.business_profile)
        self._save_json(GROWTH_LOG_FILE, self.growth_log)

    def add_growth_note(self, note: str):
        """Agent mencatat insight tentang caranya sendiri bekerja (Pendekatan A)."""
        self.growth_log.append({
            "timestamp": datetime.now().isoformat(timespec="seconds"),
            "note": note,
        })

    def update_business_profile(self, updates: dict):
        self.business_profile.update(updates)