# Demo Blog

## Быстрый старт

1. Переименуйте файл `.env.example` в `.env` в корне проекта:
   ```sh
   mv .env.example .env
   ```
2. Запустите проект с помощью Docker Compose:
   ```sh
   docker-compose up --build
   ```
3. Откройте браузер и перейдите по адресу: [http://localhost:3000](http://localhost:3000)

## Структура проекта
- `backend/` — серверная часть (Nest.js)
- `web/` — клиентская часть (Next.js)