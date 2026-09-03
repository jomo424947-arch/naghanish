"""
websocket/manager.py

WebSocket connection manager for real-time features (party rooms, notifications, etc.)
"""

# from fastapi import WebSocket
# from collections import defaultdict


# class ConnectionManager:
#     def __init__(self):
#         # room_id -> set of WebSocket connections
#         self.active_connections: dict[str, set[WebSocket]] = defaultdict(set)
#
#     async def connect(self, websocket: WebSocket, room_id: str) -> None:
#         await websocket.accept()
#         self.active_connections[room_id].add(websocket)
#
#     async def disconnect(self, websocket: WebSocket, room_id: str) -> None:
#         self.active_connections[room_id].discard(websocket)
#
#     async def broadcast(self, room_id: str, message: dict) -> None:
#         for connection in self.active_connections[room_id].copy():
#             await connection.send_json(message)
#
#     async def send_personal(self, websocket: WebSocket, message: dict) -> None:
#         await websocket.send_json(message)


# manager = ConnectionManager()

# TODO: Implement WebSocket connection manager
