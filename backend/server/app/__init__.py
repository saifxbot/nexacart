from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow

from config import Config

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()
ma = Marshmallow()
cors = CORS()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000"]}},
        supports_credentials=True,
        expose_headers="*",
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )


    # Import and register blueprints
    from .api.auth_routes import auth_bp
    from .api.product_routes import product_bp
    from .api.cart_routes import cart_bp
    from .api.order_routes import order_bp
    from .api.category_routes import category_bp
    from .api.image_routes import image_bp
    from .api.price_routes import price_bp
    from .api.inventory_routes import inventory_bp
    from .api.promotion_routes import promotion_bp
    from .api.blog_routes import blog_bp
    from .api.user_routes import user_bp
    from .api.review_routes import review_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(category_bp, url_prefix='/api')
    app.register_blueprint(image_bp, url_prefix='/api')
    app.register_blueprint(price_bp, url_prefix='/api')
    app.register_blueprint(inventory_bp, url_prefix='/api')
    app.register_blueprint(promotion_bp, url_prefix='/api')
    app.register_blueprint(blog_bp, url_prefix='/api')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(user_bp, url_prefix='/api/admin')
    # If any other resource blueprints are registered with a different prefix, update them to '/api' as well.

    return app