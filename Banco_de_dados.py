import sqlite3

def setup_database():
    conn = sqlite3.connect("election.db")
    cursor = conn.cursor()

    # Criar tabelas
    cursor.execute('''CREATE TABLE IF NOT EXISTS candidates (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT UNIQUE)''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS votes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        voter_id TEXT UNIQUE,
                        candidate_id INTEGER,
                        FOREIGN KEY(candidate_id) REFERENCES candidates(id))''')

    # Inserir candidatos
    candidates = ["Alice", "Bob", "Carlos"]
    for candidate in candidates:
        cursor.execute("INSERT OR IGNORE INTO candidates (name) VALUES (?)", (candidate,))

    conn.commit()
    conn.close()
    print("Banco de dados configurado!")

if __name__ == "__main__":
    setup_database()
