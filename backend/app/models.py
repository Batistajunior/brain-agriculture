from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Producer(Base):
    __tablename__ = "producers"

    id = Column(Integer, primary_key=True, index=True)
    cpf_cnpj = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    farms = relationship("Farm", back_populates="owner")

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String)
    state = Column(String)
    total_area = Column(Float)
    agri_area = Column(Float)
    veg_area = Column(Float)
    owner_id = Column(Integer, ForeignKey("producers.id"))

    owner = relationship("Producer", back_populates="farms")
    crops = relationship("Crop", back_populates="farm")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String)
    season = Column(String)
    farm_id = Column(Integer, ForeignKey("farms.id"))

    farm = relationship("Farm", back_populates="crops")
