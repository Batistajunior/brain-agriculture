import React, { useState, useEffect } from "react";
import api from "../services/api";

interface CropForm {
  crop_name: string;
  season: string;
}

interface ProducerFormProps {
  onSuccess: () => void;
  editingProducer?: any | null;
}

function ProducerForm({ onSuccess, editingProducer }: ProducerFormProps) {
  const [formData, setFormData] = useState({
    cpf_cnpj: "",
    name: "",
    farm_name: "",
    city: "",
    state: "",
    total_area: "",
    agri_area: "",
    veg_area: ""
  });

  const [crops, setCrops] = useState<CropForm[]>([{ crop_name: "", season: "" }]);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Preenche quando vai editar
  useEffect(() => {
    if (editingProducer) {
      setFormData({
        cpf_cnpj: editingProducer.cpf_cnpj,
        name: editingProducer.name,
        farm_name: editingProducer.farms[0]?.name || "",
        city: editingProducer.farms[0]?.city || "",
        state: editingProducer.farms[0]?.state || "",
        total_area: editingProducer.farms[0]?.total_area?.toString() || "",
        agri_area: editingProducer.farms[0]?.agri_area?.toString() || "",
        veg_area: editingProducer.farms[0]?.veg_area?.toString() || ""
      });

      if (editingProducer.farms[0]?.crops) {
        setCrops(editingProducer.farms[0].crops);
      }
    }
  }, [editingProducer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCropChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCrops((prev) => {
      const updated = [...prev];
      if (name === "crop_name" || name === "season") {
        updated[index] = { ...updated[index], [name]: value };
      }
      return updated;
    });
  };

  const addCrop = () => {
    setCrops([...crops, { crop_name: "", season: "" }]);
  };

  const removeCrop = (index: number) => {
    setCrops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingProducer) {
        await api.put(`/producers/${editingProducer.id}`, {
          cpf_cnpj: formData.cpf_cnpj,
          name: formData.name,
          farms: [
            {
              id: editingProducer.farms[0]?.id,
              name: formData.farm_name,
              city: formData.city,
              state: formData.state,
              total_area: parseFloat(formData.total_area) || 0,
              agri_area: parseFloat(formData.agri_area) || 0,
              veg_area: parseFloat(formData.veg_area) || 0,
              crops: crops,
            },
          ],
        });
        alert("✏️ Produtor atualizado com sucesso!");
      } else {
        await api.post("/producers/", {
          cpf_cnpj: formData.cpf_cnpj,
          name: formData.name,
          farms: [
            {
              name: formData.farm_name,
              city: formData.city,
              state: formData.state,
              total_area: parseFloat(formData.total_area) || 0,
              agri_area: parseFloat(formData.agri_area) || 0,
              veg_area: parseFloat(formData.veg_area) || 0,
              crops: crops,
            },
          ],
        });
        alert("✅ Produtor cadastrado com sucesso!");
      }

      onSuccess();
      setFormData({
        cpf_cnpj: "",
        name: "",
        farm_name: "",
        city: "",
        state: "",
        total_area: "",
        agri_area: "",
        veg_area: ""
      });
      setCrops([{ crop_name: "", season: "" }]);
    } catch (err: any) {
      console.error("Erro no salvamento:", err.response?.data || err);
      setError(err.response?.data?.detail || "Erro ao salvar produtor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <input name="cpf_cnpj" placeholder="CPF/CNPJ" value={formData.cpf_cnpj} onChange={handleChange} />
      <input name="name" placeholder="Nome" value={formData.name} onChange={handleChange} />
      <input name="farm_name" placeholder="Nome da Fazenda" value={formData.farm_name} onChange={handleChange} />
      <input name="city" placeholder="Cidade" value={formData.city} onChange={handleChange} />
      <input name="state" placeholder="Estado" value={formData.state} onChange={handleChange} />
      <input type="number" name="total_area" placeholder="Área Total (ha)" value={formData.total_area} onChange={handleChange} />
      <input type="number" name="agri_area" placeholder="Área Agrícola (ha)" value={formData.agri_area} onChange={handleChange} />
      <input type="number" name="veg_area" placeholder="Área de Vegetação (ha)" value={formData.veg_area} onChange={handleChange} />

      <h4>🌱 Culturas</h4>
      {crops.map((crop, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
          <input
            name="crop_name"
            placeholder="Nome da Cultura"
            value={crop.crop_name}
            onChange={(e) => handleCropChange(i, e)}
          />
          <input
            name="season"
            placeholder="Safra"
            value={crop.season}
            onChange={(e) => handleCropChange(i, e)}
          />
          <button type="button" onClick={() => removeCrop(i)}>🗑 Excluir</button>
        </div>
      ))}

      <button type="button" onClick={addCrop}>➕ Adicionar Cultura</button>
      <br />

      <button type="submit">{editingProducer ? "✏️ Atualizar" : "💾 Salvar"}</button>
      <button
        type="button"
        onClick={() => {
          setFormData({
            cpf_cnpj: "",
            name: "",
            farm_name: "",
            city: "",
            state: "",
            total_area: "",
            agri_area: "",
            veg_area: ""
          });
          setCrops([{ crop_name: "", season: "" }]);
        }}
      >
        🧹 Limpar
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
  );
}

export default ProducerForm;
