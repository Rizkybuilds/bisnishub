import json

from agent import MentorAgent

HELP_TEXT = """
Perintah yang tersedia:
  /exit          keluar & simpan sesi
  /save          simpan sesi sekarang (tanpa keluar)
  /profile       tampilkan business profile saat ini
  /help          tampilkan pesan ini
""".strip()


def main():
    agent = MentorAgent()
    print("=== Mentor Bisnis AI (lokal) ===")
    print("Ketik pesanmu, atau /help untuk lihat daftar perintah.\n")

    while True:
        try:
            user_input = input("Kamu: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\nMenyimpan sesi...")
            agent.save_session()
            break

        if not user_input:
            continue

        if user_input == "/exit":
            agent.save_session()
            print("Sesi disimpan. Sampai jumpa!")
            break
        elif user_input == "/save":
            agent.save_session()
            print("[sesi disimpan]")
            continue
        elif user_input == "/profile":
            print(json.dumps(agent.business_profile, ensure_ascii=False, indent=2))
            continue
        elif user_input == "/help":
            print(HELP_TEXT)
            continue

        reply = agent.send_message(user_input)
        print(f"\nMentor: {reply}\n")
        agent.save_session()  # auto-save tiap giliran biar aman kalau tiba-tiba nutup terminal


if __name__ == "__main__":
    main()