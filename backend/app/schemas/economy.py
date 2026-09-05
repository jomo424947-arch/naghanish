from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class StoreItemResponse(BaseModel):
    id: str
    name: str = Field(..., alias="titleAr")
    name_en: str = Field(..., alias="titleEn")
    desc_ar: str = Field(..., alias="descAr")
    desc_en: str = Field(..., alias="descEn")
    category: str
    price: int = Field(..., alias="priceCoins")
    icon: str
    rarity: str
    is_featured: bool = Field(False, alias="isFeatured")
    owned: bool = False
    is_equipped: bool = Field(False, alias="isEquipped")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PurchaseItemRequest(BaseModel):
    item_id: str


class PurchaseItemResponse(BaseModel):
    status: str
    message: str
    coins_left: int = Field(..., alias="coinsLeft")
    inventory_id: str = Field(..., alias="inventoryId")
