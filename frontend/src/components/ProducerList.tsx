import React from "react";
import api from "../services/api";

function ProducerList({ producers, onEdit, onDelete }: any) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>👩‍🌾 Produtores Cadastrados</h2>
      {producers.length === 0 ? (
        <p>Nenhum produtor cadastrado.</p>
      ) : (
        <ul>
          {producers.map((producer: any) => (
            <li key={producer.id}>
              <strong>{producer.name}</strong> ({producer.cpf_cnpj})
              <button onClick={() => onEdit(producer)}>✏️ Editar</button>
              <button onClick={() => onDelete(producer.id)}>🗑 Excluir</button>
              <ul>
                {producer.farms.map((farm: any) => (
                  <li key={farm.id}>
                    {farm.name} - {farm.city}/{farm.state}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProducerList;
