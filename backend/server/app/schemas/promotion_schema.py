from app.models.promotion import Promotion
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class PromotionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Promotion
        load_instance = True
