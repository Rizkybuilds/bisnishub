import json

from agent import MentorAgent, ROLES, BUSINESSES

HELP_TEXT = """
Perintah yang tersedia:
  /team          lihat daftar peran C-suite yang tersedia
  /switch <role> ganti peran (cto, coo, cfo, cmo, mentor)
  /bisnis        pilih/ganti konteks bisnis
  /consult       konsultasi ke peran lain tanpa ganti peran
  /profile       tampilkan business profile saat ini
  /save          simpan sesi sekarang (tanpa keluar)
  /exit          keluar & simpan sesi
  /help          tampilkan pesan ini
""".strip()


def print_banner():
    print("""
╔══════════════════════════════════════════════╗
║     🚀 AI Mentor Bisnis — Command Center     ║
║         Virtual C-Suite untuk Solopreneur     ║
╚══════════════════════════════════════════════╝
""")


def print_team():
    print("\n📋 Tim C-Suite yang tersedia:\n")
    for key, info in ROLES.items():
        print(f"  {info['emoji']}  {key:<8} — {info['label']}: {info['description']}")
    print(f"\nGunakan /switch <role> untuk ganti peran.")
    print()


def print_businesses():
    print("\n🏢 Bisnis yang tersedia:\n")
    for key, info in BUSINESSES.items():
        print(f"  {info['emoji']}  {key:<12} — {info['label']}: {info['description']}")
    print()


def select_role() -> str:
    """Menu pemilihan peran di awal."""
    print_team()
    while True:
        choice = input("Pilih peran (ketik kode, misal 'cto'): ").strip().lower()
        if choice in ROLES:
            return choice
        print(f"  ❌ Peran '{choice}' tidak dikenal. Coba lagi.")


def select_business() -> str | None:
    """Menu pemilihan bisnis."""
    print_businesses()
    print("  (kosongkan untuk tidak memilih bisnis tertentu)")
    while True:
        choice = input("Pilih bisnis (ketik kode, misal 'teestock'): ").strip().lower()
        if choice == "":
            return None
        if choice in BUSINESSES:
            return choice
        print(f"  ❌ Bisnis '{choice}' tidak dikenal. Coba lagi.")


def handle_consult(agent: MentorAgent):
    """Interaktif konsultasi ke peran lain."""
    print("\n🤝 Konsultasi ke peran lain")
    print("Peran yang tersedia:")
    for key, info in ROLES.items():
        if key != agent.role:
            print(f"  {info['emoji']}  {key:<8} — {info['label']}")

    target = input("\nKonsultasi ke siapa? (ketik kode role): ").strip().lower()
    if target not in ROLES:
        print(f"  ❌ Peran '{target}' tidak dikenal.")
        return
    if target == agent.role:
        print("  ❌ Tidak bisa konsultasi ke diri sendiri.")
        return

    question = input("Pertanyaan: ").strip()
    if not question:
        print("  ❌ Pertanyaan kosong, batal.")
        return

    target_info = ROLES[target]
    print(f"\n⏳ Mengirim pertanyaan ke {target_info['emoji']} {target_info['label']}...\n")

    reply = agent.consult(target, question)
    print(f"{target_info['emoji']} {target_info['label']}: {reply}\n")


def main():
    print_banner()

    # 1. Pilih peran
    role = select_role()
    role_info = ROLES[role]

    # 2. Pilih bisnis (opsional)
    print("\n📂 Pilih konteks bisnis (opsional):")
    business = select_business()

    # 3. Buat agent
    agent = MentorAgent(role=role, business=business)

    biz_label = ""
    if business:
        biz_label = f" • {BUSINESSES[business]['label']}"

    print(f"\n{'='*50}")
    print(f"  {role_info['emoji']}  {role_info['label']}{biz_label}")
    print(f"  {role_info['description']}")
    print(f"{'='*50}")
    print("Ketik pesanmu, atau /help untuk lihat daftar perintah.\n")

    while True:
        try:
            prompt_label = f"{role_info['emoji']} Kamu"
            user_input = input(f"{prompt_label}: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\nMenyimpan sesi...")
            agent.save_session()
            break

        if not user_input:
            continue

        # ── Commands ──
        if user_input == "/exit":
            agent.save_session()
            print("Sesi disimpan. Sampai jumpa! 👋")
            break

        elif user_input == "/save":
            agent.save_session()
            print("[✅ sesi disimpan]")
            continue

        elif user_input == "/profile":
            print(json.dumps(agent.business_profile, ensure_ascii=False, indent=2))
            continue

        elif user_input == "/help":
            print(HELP_TEXT)
            continue

        elif user_input == "/team":
            print_team()
            continue

        elif user_input.startswith("/switch"):
            parts = user_input.split(maxsplit=1)
            if len(parts) < 2:
                print("Usage: /switch <role>  (contoh: /switch cto)")
                print_team()
                continue

            new_role = parts[1].strip().lower()
            if new_role not in ROLES:
                print(f"  ❌ Peran '{new_role}' tidak dikenal.")
                print_team()
                continue

            # Simpan sesi peran lama
            agent.save_session()
            print(f"[💾 sesi {role_info['label']} disimpan]")

            # Ganti peran
            role = new_role
            role_info = ROLES[role]
            agent = MentorAgent(role=role, business=business)

            print(f"\n{'='*50}")
            print(f"  {role_info['emoji']}  Beralih ke {role_info['label']}{biz_label}")
            print(f"  {role_info['description']}")
            print(f"{'='*50}\n")
            continue

        elif user_input == "/bisnis":
            agent.save_session()
            business = select_business()
            agent = MentorAgent(role=role, business=business)
            if business:
                biz_label = f" • {BUSINESSES[business]['label']}"
                print(f"[📂 Konteks bisnis: {BUSINESSES[business]['label']}]\n")
            else:
                biz_label = ""
                print("[📂 Konteks bisnis dihapus — mode umum]\n")
            continue

        elif user_input == "/consult":
            handle_consult(agent)
            agent.save_session()
            continue

        # ── Normal message ──
        reply = agent.send_message(user_input)
        print(f"\n{role_info['emoji']} {role_info['label']}: {reply}\n")
        agent.save_session()


if __name__ == "__main__":
    main()