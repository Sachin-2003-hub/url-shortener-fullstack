# 1. Use Node.js (Alpine is smaller/faster)
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your code
COPY . .

# 6. Expose the Vite port
EXPOSE 5173

# 7. Start the app
# IMPORTANT: We add "--host" so Docker can see it!
CMD ["npm", "run", "dev", "--", "--host"]