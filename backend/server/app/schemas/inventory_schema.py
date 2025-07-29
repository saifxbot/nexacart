from app.models.inventory import Inventory
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class InventorySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Inventory
        load_instance = True
