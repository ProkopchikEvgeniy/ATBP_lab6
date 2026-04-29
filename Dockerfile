FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Install Playwright browsers
RUN npx playwright install chromium --with-deps

EXPOSE 3000

CMD ["node", "server.js"]