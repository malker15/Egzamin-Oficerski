import re
import pdfplumber
import pandas as pd

# === USTAW ===
PDF_PATH = "source.pdf"  # <- zmień na nazwę Twojego PDF w folderze projektu
OUT_CSV = "questions_from_pdf.csv"

HEADER = [
    "type","id","question","A","B","C","D","correct",
    "image","acceptedAnswers",
    "image1","answer1","image2","answer2","image3","answer3","image4","answer4"
]

Q_START_RE = re.compile(r"^\s*(\d{1,5})\.\s*(.+)\s*$")
OPT_RE = re.compile(r"^\s*([a-dA-D])\)\s*(.+)\s*$")
CORRECT_RE = re.compile(r"^\s*Poprawna\s*:\s*([a-dA-D])\)\s*$|^\s*Poprawna\s*:\s*([a-dA-D])\s*$")

def norm_spaces(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()

def finalize_question(cur):
    """
    cur structure:
      {
        num, q_lines, opts: {A:[...],B:[...],...}, correctLetter
      }
    """
    if not cur:
        return None

    qid = str(cur["num"])
    qtext = norm_spaces(" ".join(cur["q_lines"])) if cur["q_lines"] else ""

    # Join option lines
    def join_opt(k):
        lines = cur["opts"].get(k, [])
        return norm_spaces(" ".join(lines)) if lines else ""

    A = join_opt("A")
    B = join_opt("B")
    C = join_opt("C")
    D = join_opt("D")

    # If no options detected, skip (or you can export as placeholder)
    if not any([A, B, C, D]):
        return None

    correct = cur.get("correctLetter", "") or ""
    correct = correct.upper().strip()
    if correct and correct not in ["A","B","C","D"]:
        correct = ""

    # If correct exists but option doesn't, blank it
    if correct and not join_opt(correct):
        correct = ""

    row = {
        "type": "mcq",
        "id": qid,
        "question": qtext,
        "A": A,
        "B": B,
        "C": C,
        "D": D,
        "correct": correct,
        "image": "",
        "acceptedAnswers": "",
        "image1": "", "answer1": "",
        "image2": "", "answer2": "",
        "image3": "", "answer3": "",
        "image4": "", "answer4": "",
    }
    return row

def parse_lines(lines):
    rows = []

    cur = None
    current_opt = None  # "A"/"B"/"C"/"D"

    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        # Start of a new question: "330. ..."
        m_q = Q_START_RE.match(line)
        if m_q:
            # finalize previous
            row = finalize_question(cur)
            if row:
                rows.append(row)

            cur = {
                "num": m_q.group(1),
                "q_lines": [m_q.group(2)],
                "opts": {"A": [], "B": [], "C": [], "D": []},
                "correctLetter": ""
            }
            current_opt = None
            continue

        # If we haven't started a question yet, ignore
        if not cur:
            continue

        # Correct line: "Poprawna: b)"
        m_c = CORRECT_RE.match(line)
        if m_c:
            letter = (m_c.group(1) or m_c.group(2) or "").upper()
            if letter in ["A","B","C","D"]:
                cur["correctLetter"] = letter
            current_opt = None
            continue

        # Option line: "a) ..."
        m_o = OPT_RE.match(line)
        if m_o:
            letter = m_o.group(1).upper()
            text = m_o.group(2)
            if letter in ["A","B","C","D"]:
                cur["opts"][letter] = [text]
                current_opt = letter
            continue

        # Continuation lines:
        # - if currently inside option => append there
        # - else append to question text
        if current_opt in ["A","B","C","D"]:
            cur["opts"][current_opt].append(line)
        else:
            cur["q_lines"].append(line)

    # finalize last
    row = finalize_question(cur)
    if row:
        rows.append(row)

    return rows

def main():
    # Extract text page by page
    all_lines = []
    with pdfplumber.open(PDF_PATH) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            text = text.replace("\u00a0", " ")
            # keep line breaks to help parser
            all_lines.extend(text.split("\n"))

    # Normalize lines lightly (do not squash too aggressively)
    all_lines = [l.rstrip() for l in all_lines]

    rows = parse_lines(all_lines)

    if not rows:
        print("❌ Nie znaleziono żadnych pytań w oczekiwanym formacie.")
        print("Sprawdź czy PDF_PATH jest poprawny oraz czy pytania mają format '330. ...' i 'a) ...' i 'Poprawna: b)'.")
        return

    df = pd.DataFrame(rows, columns=HEADER)
    df.to_csv(OUT_CSV, index=False, encoding="utf-8")
    print(f"✅ Zapisano: {OUT_CSV}")
    print(f"   Liczba pytań MCQ: {len(rows)}")
    missing_correct = sum(1 for r in rows if not r["correct"])
    if missing_correct:
        print(f"⚠️  Bez wykrytej poprawnej odpowiedzi: {missing_correct} (do uzupełnienia ręcznie)")

if __name__ == "__main__":
    main()