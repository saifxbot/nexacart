from app.models.blog import Blog
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields

class BlogSchema(SQLAlchemyAutoSchema):
    product_ids = fields.String()
    class Meta:
        model = Blog
        load_instance = True
