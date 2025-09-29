# backend/app/routers/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import database, models

router = APIRouter()

@router.get("/")
def get_dashboard(db: Session = Depends(database.get_db)):
    farms = db.query(models.Farm).all()
    producers = db.query(models.Producer).count()
    crops = db.query(models.Crop).all()

    total_farms = len(farms)
    total_area = sum(f.total_area for f in farms) if farms else 0
    agri_area = sum(f.agri_area for f in farms) if farms else 0
    veg_area = sum(f.veg_area for f in farms) if farms else 0

    farms_by_state = {}
    for f in farms:
        farms_by_state[f.state] = farms_by_state.get(f.state, 0) + 1

    crops_by_name = {}
    for c in crops:
        crops_by_name[c.crop_name] = crops_by_name.get(c.crop_name, 0) + 1

    return {
        "totalProducers": producers,
        "totalFarms": total_farms,
        "totalArea": total_area,
        "agriArea": agri_area,
        "vegArea": veg_area,
        "farmsByState": farms_by_state,
        "cropsByName": crops_by_name,
    }
