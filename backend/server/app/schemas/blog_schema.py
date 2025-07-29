from app.models.blog import Blog
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class BlogSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Blog
        load_instance = True
