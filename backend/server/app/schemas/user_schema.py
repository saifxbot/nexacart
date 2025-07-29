from app import ma
from app.models.user import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "address", "is_admin", "created_at")
        load_instance = True
        load_instance = True