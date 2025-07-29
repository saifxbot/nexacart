from app.models.price import Price
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class PriceSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Price
        load_instance = True
