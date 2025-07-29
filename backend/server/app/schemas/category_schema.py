from app.models.category import Category
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class CategorySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
