from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class CropBase(BaseModel):
    crop_name: str
    season: str


class CropCreate(CropBase):
    pass


class Crop(CropBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class FarmBase(BaseModel):
    name: str
    city: str
    state: str
    total_area: float
    agri_area: float
    veg_area: float


class FarmCreate(FarmBase):
    crops: List[CropCreate] = []


class FarmUpdate(FarmBase):  # 🔧 permite editar fazenda
    id: Optional[int] = None


class Farm(FarmBase):
    id: int
    crops: List[Crop] = []
    model_config = ConfigDict(from_attributes=True)


class ProducerBase(BaseModel):
    cpf_cnpj: str
    name: str


class ProducerCreate(ProducerBase):
    farms: List[FarmCreate] = []


class ProducerUpdate(ProducerBase):  # 🔧 update sem exigir fazenda
    farms: Optional[List[FarmUpdate]] = []


class Producer(ProducerBase):
    id: int
    farms: List[Farm] = []
    model_config = ConfigDict(from_attributes=True)
