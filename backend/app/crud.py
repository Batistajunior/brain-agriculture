from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import models, schemas


def create_producer(db: Session, producer: schemas.ProducerCreate):
    # ✅ verificando duplicidade de CPF/CNPJ
    existing = db.query(models.Producer).filter(models.Producer.cpf_cnpj == producer.cpf_cnpj).first()
    if existing:
        raise HTTPException(status_code=400, detail="❌ CPF/CNPJ já cadastrado")

    # Criando produtor
    db_producer = models.Producer(
        cpf_cnpj=producer.cpf_cnpj,
        name=producer.name
    )
    db.add(db_producer)
    db.flush()  # garantindo que já temos o ID do produtor

    # Criando fazendas associadas
    for farm in producer.farms:
        # regra de negócio: validação da área
        if (farm.agri_area + farm.veg_area) > farm.total_area:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"A soma da área agrícola ({farm.agri_area}) + vegetação ({farm.veg_area}) "
                    f"não pode ultrapassar a área total ({farm.total_area}) da fazenda '{farm.name}'."
                )
            )

        db_farm = models.Farm(
            name=farm.name,
            city=farm.city,
            state=farm.state,
            total_area=farm.total_area,
            agri_area=farm.agri_area,
            veg_area=farm.veg_area,
            owner_id=db_producer.id,
        )
        db.add(db_farm)
        db.flush()  # garantindo ID da fazenda

        # Criando culturas associadas
        for crop in farm.crops:
            db_crop = models.Crop(
                crop_name=crop.crop_name,
                season=crop.season,
                farm_id=db_farm.id
            )
            db.add(db_crop)

    # Commit apenas no final, garantindo atomicidade
    db.commit()
    db.refresh(db_producer)

    return db_producer


def get_producers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Producer).offset(skip).limit(limit).all()
