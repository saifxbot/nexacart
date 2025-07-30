from app.models.promotion import Promotion
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from marshmallow import fields

class PromotionSchema(SQLAlchemyAutoSchema):
    discount = fields.String()
    class Meta:
        model = Promotion
        load_instance = True
