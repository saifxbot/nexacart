from app.models.inventory import Inventory
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields

class InventorySchema(SQLAlchemyAutoSchema):
    product_id = fields.Integer()
    class Meta:
        model = Inventory
        load_instance = True
