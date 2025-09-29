import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  totalProducers: number;
  totalFarms: number;
  totalArea: number;
  agriArea: number;
  vegArea: number;
  farmsByState: Record<string, number>;
  cropsByName: Record<string, number>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8E44AD"];

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/dashboard/")
      .then((res) => {
        setDashboard(res.data);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>❌ Erro ao carregar o dashboard</p>;
  }

  if (!dashboard) {
    return <p>⏳ Carregando...</p>;
  }

  // 🔹 Dados formatados para gráficos
  const stateData = Object.entries(dashboard.farmsByState).map(
    ([state, count]) => ({
      name: state,
      value: count,
    })
  );

  const cropData = Object.entries(dashboard.cropsByName).map(
    ([crop, count]) => ({
      name: crop,
      value: count,
    })
  );

  const landUseData = [
    { name: "Área Agrícola", value: dashboard.agriArea },
    { name: "Área Vegetação", value: dashboard.vegArea },
  ];

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        📊 Dashboard
      </h2>

      <ul style={{ lineHeight: "1.8" }}>
        <li>
          <strong>Total de Produtores:</strong> {dashboard.totalProducers}
        </li>
        <li>
          <strong>Total de Fazendas:</strong> {dashboard.totalFarms}
        </li>
        <li>
          <strong>Área Total Registrada:</strong> {dashboard.totalArea} ha
        </li>
      </ul>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          marginTop: "25px",
          justifyContent: "center",
        }}
      >
        {/* 🔹 Fazendas por Estado */}
        <div style={{ flex: 1, minWidth: "320px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            🌎 Fazendas por Estado
          </h3>
          {stateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stateData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                >
                  {stateData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "gray" }}>Nenhum estado cadastrado 🌎</p>
          )}
        </div>

        {/* 🔹 Culturas */}
        <div style={{ flex: 1, minWidth: "320px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            🌱 Culturas Registradas
          </h3>
          {cropData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                >
                  {cropData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "gray" }}>Nenhuma cultura cadastrada ainda 🌱</p>
          )}
        </div>

        {/* 🔹 Uso do Solo */}
        <div style={{ flex: 1, minWidth: "320px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            🌾 Uso do Solo
          </h3>
          {dashboard.agriArea > 0 || dashboard.vegArea > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={landUseData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                >
                  {landUseData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "gray" }}>Sem áreas cadastradas 🌾</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
