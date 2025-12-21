import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/transactions";

function App() {
  const [trans, setTrans] = useState([]);
  const [name, setName] = useState("");
  const [amt, setAmt] = useState(0);
  const [mode, setMode] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTrans(data));
  }, []);

  const addTrans = async () => {
    if (!name || !amt || !mode) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amt, mode })
    });

    const newTrans = await res.json();
    setTrans([...trans, newTrans]);
    setName("");
    setAmt(0);
    setMode("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Expense Tracker</h1>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Transaction name"
      />
      <input
        type="number"
        value={amt}
        onChange={e => setAmt(e.target.value)}
        placeholder="Transaction amount"
      />
      <input
        value={mode}
        onChange={e => setMode(e.target.value)}
        placeholder="Mode (incoming/outgoing)"
      />
      <button onClick={addTrans}>Add</button>

      <ul>
        {trans.map(t => (
          <li key={t.id}>{t.name} -- {t.amt} ({t.mode}) </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

