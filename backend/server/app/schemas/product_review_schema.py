from app import ma
from app.models.product_review import ProductReview

class ProductReviewSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ProductReview
        include_fk = True
        load_instance = True
