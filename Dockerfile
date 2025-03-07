# Используем актуальную версию Node
FROM node:20.11-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Обновляем npm до стабильной версии
RUN npm install -g npm@10.5.0

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
# RUN npm install --legacy-peer-deps
RUN npm install

# Копируем весь код проекта
COPY . ./

# Сборка проекта внутри контейнера
RUN npm run build

# Запуск приложения
CMD ["npm", "run", "start"]