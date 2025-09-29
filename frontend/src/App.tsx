import React, { useState, useEffect } from "react";
import ProducerForm from "./components/ProducerForm";
import Dashboard from "./components/Dashboard";
import api from "./services/api";

function App() {
  const [producers, setProducers] = useState<any[]>([]);
  const [editingProducer, setEditingProducer] = useState<any | null>(null);

  const loadProducers = () => {
    api.get("/producers/").then((res) => setProducers(res.data));
  };

  useEffect(() => {
    loadProducers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌱 Brain Agriculture</h1>

      {/* 🔹 Formulário */}
      <ProducerForm onSuccess={loadProducers} editingProducer={editingProducer} />

      {/* 🔹 Dashboard */}
      <Dashboard />

      {/* 🔹 Lista de produtores */}
      <h2>👩‍🌾 Produtores Cadastrados</h2>
      {producers.map((p) => (
        <div key={p.id}>
          {p.name} ({p.cpf_cnpj})
          <button onClick={() => setEditingProducer(p)}>✏️ Editar</button>
          <button onClick={async () => {
            await api.delete(`/producers/${p.id}`);
            loadProducers();
          }}>🗑 Excluir</button>
          <p>{p.farms[0]?.name} - {p.farms[0]?.city}/{p.farms[0]?.state}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
