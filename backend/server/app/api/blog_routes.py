from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.api.auth_routes import admin_required
from app.models.blog import Blog
from app.schemas.blog_schema import BlogSchema
from app import db

blog_bp = Blueprint('blog_bp', __name__)
blog_schema = BlogSchema()
blogs_schema = BlogSchema(many=True)

@blog_bp.route('/admin/blogs', methods=['POST'])
@jwt_required()
@admin_required
def create_blog():
    data = request.get_json()
    blog = Blog(title=data['title'], content=data['content'], image_url=data.get('image_url'))
    db.session.add(blog)
    db.session.commit()
    return blog_schema.dump(blog), 201

@blog_bp.route('/admin/blogs', methods=['GET'])
@jwt_required()
@admin_required
def get_blogs():
    blogs = Blog.query.all()
    return jsonify(blogs_schema.dump(blogs))

@blog_bp.route('/admin/blogs/<int:blog_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    return blog_schema.dump(blog)

@blog_bp.route('/admin/blogs/<int:blog_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    data = request.get_json()
    if 'title' in data:
        blog.title = data['title']
    if 'content' in data:
        blog.content = data['content']
    if 'image_url' in data:
        blog.image_url = data['image_url']
    db.session.commit()
    return blog_schema.dump(blog)

@blog_bp.route('/admin/blogs/<int:blog_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    db.session.delete(blog)
    db.session.commit()
    return jsonify({"message": "Blog deleted"})
