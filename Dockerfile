# استفاده از آخرین نسخه Node
FROM node:latest

# تنظیم مسیر کاری داخل کانتینر
WORKDIR /app

# کپی فایل‌های package.json و package-lock.json
COPY package*.json ./

# نصب تمام dependencies و devDependencies
RUN npm install --include=dev

# کپی کل پروژه
COPY . .

# expose پورت dev (vite)
EXPOSE 5173

# دستور پیش‌فرض برای dev
CMD ["npm", "run", "dev", "--", "--host"]
