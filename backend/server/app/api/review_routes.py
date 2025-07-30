from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.models.product_review import ProductReview
from app.schemas.product_review_schema import ProductReviewSchema
from app import db
from app.api.auth_routes import admin_required

review_bp = Blueprint('review_bp', __name__)
review_schema = ProductReviewSchema()
reviews_schema = ProductReviewSchema(many=True)


# Admin: Get all reviews
@review_bp.route('/admin', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_all_reviews():
    if request.method == 'OPTIONS':
        return '', 204
    reviews = ProductReview.query.order_by(ProductReview.created_at.desc()).all()
    return jsonify(reviews_schema.dump(reviews))

# User: Create a review
@review_bp.route('/', methods=['POST'])
@jwt_required()
def create_review():
    from flask_jwt_extended import get_jwt_identity
    data = request.get_json()
    user_id = get_jwt_identity()
    product_id = data.get('product_id')
    rating = data.get('rating')
    comment = data.get('comment', '')
    if not product_id or not rating:
        return jsonify({'message': 'product_id and rating are required'}), 400
    review = ProductReview(product_id=product_id, user_id=user_id, rating=rating, comment=comment)
    db.session.add(review)
    db.session.commit()
    return jsonify(review_schema.dump(review)), 201

# Admin: Delete a review
@review_bp.route('/admin/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    review = ProductReview.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted'})
