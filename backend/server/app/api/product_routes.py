

from flask import Blueprint, jsonify, request, abort
from app.models.product import Product
from app.models.product_review import ProductReview
from app.schemas.product_schema import ProductSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db

product_bp = Blueprint('product_bp', __name__)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
# ...existing code...

# SEARCH & FILTER products
@product_bp.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '')
    category = request.args.get('category')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)

    products = Product.query
    if query:
        products = products.filter(Product.name.ilike(f'%{query}%'))
    if category:
        products = products.filter_by(category=category)
    if min_price is not None:
        products = products.filter(Product.price >= min_price)
    if max_price is not None:
        products = products.filter(Product.price <= max_price)
    products = products.all()
    return jsonify(products_schema.dump(products))

# ADD product review
@product_bp.route('/<int:product_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(product_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not rating or not (1 <= rating <= 5):
        return jsonify({"message": "Rating must be between 1 and 5"}), 400

    review = ProductReview(product_id=product_id, user_id=user_id, rating=rating, comment=comment)
    db.session.add(review)
    db.session.commit()
    return jsonify({"message": "Review added"}), 201

# GET product reviews
@product_bp.route('/<int:product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    reviews = ProductReview.query.filter_by(product_id=product_id).all()
    return jsonify([
        {
            "user_id": r.user_id,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at
        } for r in reviews
    ])





from app.api.auth_routes import admin_required

# CREATE product
@product_bp.route('/admin/products', methods=['POST'])
@jwt_required()
@admin_required
def create_product():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    try:
        new_product = Product(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            stock_quantity=data.get('stock_quantity', 0),
            image_url=data.get('image_url'),
            category_id=data.get('category_id')
        )
        db.session.add(new_product)
        db.session.commit()
        return product_schema.dump(new_product), 201
    except KeyError as e:
        return jsonify({"message": f"Missing field: {e.args[0]}"}), 400

# READ all products
@product_bp.route('/admin/products', methods=['GET'])
@jwt_required()
@admin_required
def get_products():
    all_products = Product.query.all()
    return jsonify(products_schema.dump(all_products))

# READ single product
@product_bp.route('/admin/products/<int:product_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product_schema.dump(product))

# UPDATE product
@product_bp.route('/admin/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    for field in ['name', 'description', 'price', 'stock_quantity', 'image_url', 'category_id']:
        if field in data:
            setattr(product, field, data[field])
    db.session.commit()
    return product_schema.dump(product)

# DELETE product
@product_bp.route('/admin/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"})