import sqlite3

def votar():
    voter_id = input("Digite seu ID de eleitor: ").strip()

    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    # Verif voto
    cursor.execute("SELECT * FROM votes WHERE voter_id=?", (voter_id,))
    if cursor.fetchone():
        print("⚠️ Você já votou!") 
        conn.close()
        return

    # List candidatos
    cursor.execute("SELECT * FROM candidates")
    candidates = cursor.fetchall()

    print("\nCandidatos disponíveis:")
    for candidate in candidates:
        print(f"{candidate[0]} - {candidate[1]}")

    try:
        choice = int(input("\nDigite o número do candidato: "))
        cursor.execute("SELECT id FROM candidates WHERE id=?", (choice,))
        if cursor.fetchone():
            cursor.execute("INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)", (voter_id, choice))
            conn.commit()
            print("✅ Voto registrado com sucesso!")
        else:
            print("❌ Candidato inválido!")
    except ValueError:
        print("❌ Entrada inválida!")

    conn.close()

def mostrar_resultados():
    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    # Contar votos
    cursor.execute('''SELECT candidates.name, COUNT(votes.id)
                      FROM candidates LEFT JOIN votes
                      ON candidates.id = votes.candidate_id
                      GROUP BY candidates.name''')

    results = cursor.fetchall()
    conn.close()

    # Exibir resultados
    print("\nResultados da votação:")
    for name, count in results:
        print(f"{name}: {count} votos")

def menu():
    while True:
        print("\n📌 Sistema de Votação")
        print("1. Votar")
        print("2. Ver Resultados")
        print("3. Sair")

        choice = input("Escolha uma opção: ").strip()
        if choice == "1":
            votar()
        elif choice == "2":
            mostrar_resultados()
        elif choice == "3":
            print("Encerrando...")
            break
        else:
            print("❌ Opção inválida!")

if __name__ == "__main__":
    menu()
