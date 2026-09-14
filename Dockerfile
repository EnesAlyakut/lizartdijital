# syntax=docker/dockerfile:1

# --------------------------------------------------------------------------
# Bağımlılıklar
# --------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json ./
RUN npm ci

# --------------------------------------------------------------------------
# Derleme
# --------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma istemcisi derlemeden önce üretilir.
RUN npx prisma generate

# Derleme sırasında veritabanına bağlanılmaz; yalnızca istemci tipleri gerekir.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --------------------------------------------------------------------------
# Çalıştırma
# --------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Uygulama root olmayan kullanıcıyla çalışır.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Dijital ürün dosyaları kalıcı bir birime bağlanmalıdır (docker-compose'a bakın).
RUN mkdir -p /app/private-files && chown -R nextjs:nodejs /app/private-files /app/.next

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]
