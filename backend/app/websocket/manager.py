"""
websocket/manager.py

WebSocket connection manager for real-time multiplayer party rooms and alerts.
Supports broadcasting, personal messaging, room channel tracking, and Redis Pub/Sub hooks.
"""

from fastapi import WebSocket
from collections import defaultdict
from typing import Dict, Set, Any
import json
import logging

logger = logging.getLogger("naghanish.websocket")


class ConnectionManager:
    def __init__(self):
        # room_code -> set of active WebSocket client connections
        self.active_rooms: Dict[str, Set[WebSocket]] = defaultdict(set)
        # user_id -> set of active user WebSocket connections (for personal notifications)
        self.user_connections: Dict[str, Set[WebSocket]] = defaultdict(set)

    async def connect_room(self, websocket: WebSocket, room_code: str, user_id: str | None = None) -> None:
        """Accept connection and register into room."""
        await websocket.accept()
        room_code = room_code.upper()
        self.active_rooms[room_code].add(websocket)
        if user_id:
            self.user_connections[user_id].add(websocket)
        logger.info(f"WebSocket connected to room {room_code}. Total in room: {len(self.active_rooms[room_code])}")

    async def disconnect_room(self, websocket: WebSocket, room_code: str, user_id: str | None = None) -> None:
        """Remove connection from room on disconnect."""
        room_code = room_code.upper()
        self.active_rooms[room_code].discard(websocket)
        if not self.active_rooms[room_code]:
            self.active_rooms.pop(room_code, None)
        if user_id:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                self.user_connections.pop(user_id, None)
        logger.info(f"WebSocket disconnected from room {room_code}")

    async def broadcast_to_room(self, room_code: str, event: str, data: Any) -> None:
        """Broadcast an event to all connected players in a room."""
        room_code = room_code.upper()
        message = {"event": event, "data": data}
        connections = list(self.active_rooms.get(room_code, []))
        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Error sending message to client: {e}")
                self.active_rooms[room_code].discard(connection)

    async def send_to_user(self, user_id: str, event: str, data: Any) -> None:
        """Send personal event directly to a specific user's connections."""
        message = {"event": event, "data": data}
        connections = list(self.user_connections.get(user_id, []))
        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Error sending personal message: {e}")
                self.user_connections[user_id].discard(connection)


ws_manager = ConnectionManager()
