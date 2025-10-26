# استفاده از آخرین نسخه Node
FROM node:latest

# تنظیم مسیر کاری داخل کانتینر
WORKDIR /app

# کپی فایل‌های پکیج برای نصب
COPY package*.json ./

# نصب پکیج‌ها (npm ci سریع‌تره، ولی اگه lock فایل نداری از npm install استفاده کن)
RUN npm install

# کپی کل سورس پروژه
COPY . .

# باز کردن پورت (مثلاً 5173 برای Vite)
EXPOSE 5173

# اجرای پروژه در حالت dev
CMD ["npm", "run", "dev", "--", "--host"]
