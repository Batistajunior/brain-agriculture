import pytest
from app import models


def test_dashboard_with_data(client, db_session):
    # cria produtor
    producer = models.Producer(cpf_cnpj="12345678901", name="Produtor Teste")
    db_session.add(producer)
    db_session.flush()

    # cria fazenda
    farm = models.Farm(
        name="Fazenda Teste",
        city="Salvador",
        state="BA",
        total_area=120,
        agri_area=60,
        veg_area=60,
        owner_id=producer.id,
    )
    db_session.add(farm)
    db_session.flush()

    # cria cultura
    crop = models.Crop(
        crop_name="Feijão",
        season="2024/2025",
        farm_id=farm.id,
    )
    db_session.add(crop)
    db_session.commit()

    # chama dashboard
    response = client.get("/dashboard/")
    assert response.status_code == 200
    data = response.json()

    # valida agregados
    assert data["totalProducers"] == 1
    assert data["totalFarms"] == 1
    assert data["totalArea"] == 120
    assert data["agriArea"] == 60
    assert data["vegArea"] == 60

    # valida crops por nome
    assert "cropsByName" in data
    assert data["cropsByName"]["Feijão"] == 1

    # valida farms por estado
    assert "farmsByState" in data
    assert data["farmsByState"]["BA"] == 1
