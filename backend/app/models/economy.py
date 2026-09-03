import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class StoreItem(Base):
    __tablename__ = "store_items"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    title_ar: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    desc_ar: Mapped[str] = mapped_column(String(500), nullable=False)
    desc_en: Mapped[str] = mapped_column(String(500), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="avatar")  # avatar, title, sound_pack, theme, pass
    price_coins: Mapped[int] = mapped_column(Integer, default=500)
    icon: Mapped[str] = mapped_column(String(50), default="🛍️")
    rarity: Mapped[str] = mapped_column(String(50), default="rare")  # common, rare, epic, legendary
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)


class UserInventory(Base):
    __tablename__ = "user_inventories"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, default=lambda: f"inv_{uuid.uuid4().hex[:10]}")
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    item_id: Mapped[str] = mapped_column(String(50), ForeignKey("store_items.id", ondelete="CASCADE"), index=True, nullable=False)
    is_equipped: Mapped[bool] = mapped_column(Boolean, default=False)
    purchased_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    item = relationship("StoreItem")
    user = relationship("User", backref="inventory_items")
