"""
middleware/logging.py

Request/response logging middleware.
"""

# import time
# import logging
# from fastapi import FastAPI, Request
# from starlette.middleware.base import BaseHTTPMiddleware

# logger = logging.getLogger("naghanish.requests")


# class LoggingMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         start = time.time()
#         response = await call_next(request)
#         duration = time.time() - start
#         logger.info(f"{request.method} {request.url.path} {response.status_code} {duration:.3f}s")
#         return response


# def setup_logging(app: FastAPI) -> None:
#     app.add_middleware(LoggingMiddleware)

# TODO: Implement logging middleware
