# API Guide

## Overview

The Naghanish API is built with **FastAPI** and follows RESTful conventions.

Base URL: `http://localhost:8000/api/v1`

## Authentication

<!-- TODO: Document JWT authentication flow -->

## Endpoints

### Auth
`/api/v1/auth/` — Registration, login, token refresh, logout

### Users
`/api/v1/users/` — User management

### Games
`/api/v1/games/` — Game catalog and sessions

### Quizzes
`/api/v1/quizzes/` — Quiz management

### Party
`/api/v1/party/` — Room creation and management

### Leaderboard
`/api/v1/leaderboard/` — Rankings and scores

### Achievements
`/api/v1/achievements/` — Achievement catalog and user progress

### Missions
`/api/v1/missions/` — Daily challenges and missions

### Friends
`/api/v1/friends/` — Friend requests and relationships

### Notifications
`/api/v1/notifications/` — User notifications

### Search
`/api/v1/search/` — Global search

### Profile
`/api/v1/profile/` — User profile management

### Settings
`/api/v1/settings/` — User preferences

### Community
`/api/v1/community/` — Community content

### AI
`/api/v1/ai/` — AI recommendations and features

## Error Codes

<!-- TODO: Document standard error response format and error codes -->

## Rate Limiting

<!-- TODO: Document rate limiting policies -->

## WebSockets

<!-- TODO: Document WebSocket endpoints for real-time features -->
