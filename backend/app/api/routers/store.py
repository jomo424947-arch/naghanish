import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.database.session import get_db
from app.models.economy import StoreItem, UserInventory
from app.models.user import User
from app.schemas.economy import StoreItemResponse, PurchaseItemRequest, PurchaseItemResponse
from app.dependencies.auth import get_current_active_user, get_optional_user

router = APIRouter()


@router.get("", response_model=List[StoreItemResponse])
async def list_store_items(
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """List all available store items and indicate which ones are owned/equipped by the user."""
    result = await db.execute(select(StoreItem))
    items = result.scalars().all()

    user_inventory_map = {}
    if current_user:
        inv_res = await db.execute(
            select(UserInventory).where(UserInventory.user_id == current_user.id)
        )
        user_inventory_map = {inv.item_id: inv for inv in inv_res.scalars().all()}

    response_items = []
    for item in items:
        inv_record = user_inventory_map.get(item.id)
        response_items.append(
            StoreItemResponse(
                id=item.id,
                titleAr=item.title_ar,
                titleEn=item.title_en,
                descAr=item.desc_ar,
                descEn=item.desc_en,
                category=item.category,
                priceCoins=item.price_coins,
                icon=item.icon,
                rarity=item.rarity,
                isFeatured=item.is_featured,
                owned=inv_record is not None,
                isEquipped=inv_record.is_equipped if inv_record else False,
            )
        )

    return response_items


@router.post("/purchase", response_model=PurchaseItemResponse)
async def purchase_item(
    payload: PurchaseItemRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Purchase a store item using player's coins."""
    # 1. Fetch item
    item_res = await db.execute(select(StoreItem).where(StoreItem.id == payload.item_id))
    item = item_res.scalars().first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="العنصر غير موجود في المتجر")

    # 2. Check if already owned
    existing_res = await db.execute(
        select(UserInventory).where(
            and_(
                UserInventory.user_id == current_user.id,
                UserInventory.item_id == payload.item_id,
            )
        )
    )
    if existing_res.scalars().first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="أنت تمتلك هذا العنصر بالفعل")

    # 3. Check coin balance
    if current_user.coins < item.price_coins:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"رصيد الكوينز غير كافٍ. تحتاج إلى {item.price_coins} كوينز بينما رصيدك {current_user.coins}",
        )

    # 4. Deduct coins and create inventory entry
    current_user.coins -= item.price_coins
    inv_entry = UserInventory(
        id=f"inv_{uuid.uuid4().hex[:10]}",
        user_id=current_user.id,
        item_id=item.id,
        is_equipped=False,
        purchased_at=datetime.utcnow(),
    )
    db.add(current_user)
    db.add(inv_entry)
    await db.commit()
    await db.refresh(inv_entry)

    return PurchaseItemResponse(
        status="success",
        message=f"تم شراء {item.title_ar} بنجاح! 🛍️",
        coinsLeft=current_user.coins,
        inventoryId=inv_entry.id,
    )
