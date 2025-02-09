# Используем актуальную версию Node
FROM node:19-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем весь код проекта
COPY . ./

# Сборка проекта внутри контейнера
RUN npm run build

# Запуск приложения
CMD npm run dev
# CMD ["npm", "run", "start:dev"]