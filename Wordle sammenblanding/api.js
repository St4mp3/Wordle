class Api {
  constructor() {}

  async wordLists() {
    statusText = "Henter danske ordlister...";

    try {
      const [wRes, fRes] = await Promise.all([
        fetch(WORDLIST_URL),
        fetch(FREQ_URL),
      ]);

      const [wText, fText] = await Promise.all([wRes.text(), fRes.text()]);

      const freq = new Set();
      for (const line of fText.split("\n")) {
        const w = line.trim().split(/\s+/)[0];
        if (w) freq.add(w.toLowerCase());
      }

      const set = new Set();
      const arr = [];

      for (const line of wText.split("\n")) {
        const w = line.trim().toLowerCase();

        if (w.length !== 5) continue;
        if (!/^[a-zæøå]+$/.test(w)) continue;
        if (!freq.has(w)) continue;

        if (!set.has(w)) {
          set.add(w);
          arr.push(w);
        }
      }

      words5 = arr;
      wordsSet = set;

      statusText = "Klar: " + words5.length + " danske ord";
      board.startGame();
    } catch (err) {
      console.error(err);
      statusText = "Fejl ved hentning af ordlister";
    }
  }
}
