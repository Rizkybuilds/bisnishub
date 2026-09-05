import json
from pathlib import Path
from datetime import datetime

from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

BASE_DIR = Path(__file__).parent
PROMPTS_DIR = BASE_DIR / "prompts"
MEMORY_DIR = BASE_DIR / "memory"

PROFILE_FILE = MEMORY_DIR / "business_profile.json"

# Ganti sesuai model terbaru yang mau kamu pakai
MODEL = "claude-sonnet-5"
MAX_TOKENS = 2048

# ── Role registry ──────────────────────────────────────────────────
ROLES = {
    "mentor": {
        "label": "Mentor Bisnis",
        "persona_file": "mentor_persona.md",
        "emoji": "🧠",
        "description": "Thinking partner & strategi bisnis keseluruhan",
    },
    "cto": {
        "label": "CTO",
        "persona_file": "cto_persona.md",
        "emoji": "🔧",
        "description": "Teknologi, arsitektur produk, development roadmap",
    },
    "coo": {
        "label": "COO",
        "persona_file": "coo_persona.md",
        "emoji": "⚙️",
        "description": "Operasional, SOP, supply chain, eksekusi",
    },
    "cfo": {
        "label": "CFO",
        "persona_file": "cfo_persona.md",
        "emoji": "💰",
        "description": "Keuangan, pricing, budgeting, profitability",
    },
    "cmo": {
        "label": "CMO",
        "persona_file": "cmo_persona.md",
        "emoji": "📢",
        "description": "Marketing, branding, growth, customer acquisition",
    },
}

# Bisnis yang tersedia
BUSINESSES = {
    "teestock": {
        "label": "TeeStock",
        "emoji": "👕",
        "description": "Apparel POD Brand",
    },
    "multigraph": {
        "label": "MultiGraph",
        "emoji": "🖨️",
        "description": "Printing Business",
    },
    "titik-buta": {
        "label": "Titik Buta",
        "emoji": "👁️",
        "description": "TBD",
    },
}


class MentorAgent:
    def __init__(self, role: str = "mentor", business: str | None = None):
        if role not in ROLES:
            raise ValueError(f"Role '{role}' tidak dikenal. Pilih: {list(ROLES)}")

        self.role = role
        self.business = business
        self.client = Anthropic()

        # Load role-specific persona
        persona_path = PROMPTS_DIR / ROLES[role]["persona_file"]
        self.persona = self._load_text(persona_path)

        # Per-role history & growth log
        self.history = self._load_json(self._history_path(), default=[])
        self.growth_log = self._load_json(self._growth_log_path(), default=[])

        # Shared business profile
        self.business_profile = self._load_json(PROFILE_FILE, default={})

    # ---------- path helpers ----------
    def _history_path(self) -> Path:
        suffix = f"_{self.role}" if self.role != "mentor" else ""
        return MEMORY_DIR / f"history{suffix}.json"

    def _growth_log_path(self) -> Path:
        suffix = f"_{self.role}" if self.role != "mentor" else ""
        return MEMORY_DIR / f"growth_log{suffix}.json"

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
        """Gabungkan persona inti + konteks bisnis + catatan self-reflection."""
        parts = [self.persona]

        # Konteks bisnis yang sedang dibahas
        if self.business and self.business in BUSINESSES:
            biz = BUSINESSES[self.business]
            parts.append(
                f"\n\n## Konteks bisnis yang sedang dibahas\n"
                f"Saat ini kamu sedang membahas bisnis **{biz['label']}** "
                f"({biz['description']}). Fokuskan saran dan analisismu "
                f"pada konteks bisnis ini."
            )

        if self.business_profile:
            parts.append(
                "\n\n## Konteks ide bisnis (business_profile.json)\n"
                f"{json.dumps(self.business_profile, ensure_ascii=False, indent=2)}"
            )

        if self.growth_log:
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

    # ---------- cross-role consultation ----------
    def consult(self, target_role: str, question: str) -> str:
        """Konsultasi ke peran lain tanpa mengganggu history peran saat ini."""
        if target_role not in ROLES:
            return f"Role '{target_role}' tidak dikenal. Pilih: {', '.join(ROLES)}"

        # Buat agent sementara untuk peran target
        temp_agent = MentorAgent(role=target_role, business=self.business)

        # Kirim pertanyaan dengan konteks siapa yang bertanya
        role_info = ROLES[self.role]
        context_question = (
            f"[Konsultasi dari {role_info['label']}]\n\n"
            f"Pertanyaan: {question}"
        )

        reply = temp_agent.send_message(context_question)

        # Simpan ke history peran saat ini sebagai catatan konsultasi
        target_info = ROLES[target_role]
        self.history.append({
            "role": "user",
            "content": f"[Saya meminta pendapat {target_info['label']}]: {question}",
        })
        self.history.append({
            "role": "assistant",
            "content": f"[Jawaban dari {target_info['emoji']} {target_info['label']}]:\n\n{reply}",
        })

        return reply

    # ---------- persistence ----------
    def save_session(self):
        self._save_json(self._history_path(), self.history)
        self._save_json(self._growth_log_path(), self.growth_log)
        self._save_json(PROFILE_FILE, self.business_profile)

    def add_growth_note(self, note: str):
        """Agent mencatat insight tentang caranya sendiri bekerja."""
        self.growth_log.append({
            "timestamp": datetime.now().isoformat(timespec="seconds"),
            "note": note,
        })

    def update_business_profile(self, updates: dict):
        self.business_profile.update(updates)