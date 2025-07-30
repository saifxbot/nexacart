"""Remove category_id from product

Revision ID: remove_category_id_from_product
Revises: 50b386b7a231
Create Date: 2025-07-30 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'remove_category_id_from_product'
down_revision = '50b386b7a231'
branch_labels = None
depends_on = None

"""
Alembic migration script to remove category_id column from product table.
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    with op.batch_alter_table('product') as batch_op:
        batch_op.drop_column('category_id')

def downgrade():
    with op.batch_alter_table('product') as batch_op:
        batch_op.add_column(sa.Column('category_id', sa.Integer(), nullable=True))
