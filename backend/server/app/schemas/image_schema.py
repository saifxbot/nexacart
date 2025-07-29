from app.models.image import Image
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class ImageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True
