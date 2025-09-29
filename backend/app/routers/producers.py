from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models, database, crud

router = APIRouter()

# ----------------------------
# CREATE
# ----------------------------
@router.post("/", response_model=schemas.Producer)
def create_producer(producer: schemas.ProducerCreate, db: Session = Depends(database.get_db)):
    return crud.create_producer(db=db, producer=producer)

# ----------------------------
# READ (LIST)
# ----------------------------
@router.get("/", response_model=list[schemas.Producer])
def list_producers(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    return db.query(models.Producer).offset(skip).limit(limit).all()

# ----------------------------
# UPDATE
# ----------------------------
@router.put("/{producer_id}", response_model=schemas.Producer)
def update_producer(producer_id: int, producer: schemas.ProducerUpdate, db: Session = Depends(database.get_db)):
    db_producer = db.query(models.Producer).filter(models.Producer.id == producer_id).first()
    if not db_producer:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    db_producer.cpf_cnpj = producer.cpf_cnpj
    db_producer.name = producer.name
    db.commit()
    db.refresh(db_producer)

    if producer.farms:
        for farm in producer.farms:
            if farm.id:  # update
                db_farm = db.query(models.Farm).filter(models.Farm.id == farm.id).first()
                if db_farm:
                    db_farm.name = farm.name
                    db_farm.city = farm.city
                    db_farm.state = farm.state
                    db_farm.total_area = farm.total_area
                    db_farm.agri_area = farm.agri_area
                    db_farm.veg_area = farm.veg_area
            else:  # create new farm
                new_farm = models.Farm(
                    name=farm.name,
                    city=farm.city,
                    state=farm.state,
                    total_area=farm.total_area,
                    agri_area=farm.agri_area,
                    veg_area=farm.veg_area,
                    owner_id=db_producer.id,
                )
                db.add(new_farm)
        db.commit()

    return db_producer

# ----------------------------
# DELETE
# ----------------------------
@router.delete("/{producer_id}")
def delete_producer(producer_id: int, db: Session = Depends(database.get_db)):
    db_producer = db.query(models.Producer).filter(models.Producer.id == producer_id).first()
    if not db_producer:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")

    db.delete(db_producer)
    db.commit()
    return {"ok": True, "msg": "Produtor deletado com sucesso"}
