from app import ma
from app.models.product import Product

from marshmallow import fields

class ProductSchema(ma.SQLAlchemyAutoSchema):
    # category_id removed
    class Meta:
        model = Product
        load_instance = True