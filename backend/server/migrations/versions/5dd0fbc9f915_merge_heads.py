"""merge heads

Revision ID: 5dd0fbc9f915
Revises: 8a0933034f36, remove_category_id_from_product
Create Date: 2025-07-30 10:29:41.520128

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5dd0fbc9f915'
down_revision = ('8a0933034f36', 'remove_category_id_from_product')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
