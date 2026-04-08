FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_PUBLIC_SUPABASE_URL=https://supabase.mystoredigital.cloud
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI5NzI4MDAwLCJleHAiOjE4ODc0OTQ0MDB9.DSRFl2a9ZlpjB0nT7D30u0Qq8aRtsAfifQmftzVAe5U
ENV NEXT_PUBLIC_SITE_URL=https://lajerga.app
ENV NEXT_PUBLIC_ADSENSE_ID=ca-pub-1321706024272690
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_PUBLIC_SUPABASE_URL=https://supabase.mystoredigital.cloud
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI5NzI4MDAwLCJleHAiOjE4ODc0OTQ0MDB9.DSRFl2a9ZlpjB0nT7D30u0Qq8aRtsAfifQmftzVAe5U
ENV NEXT_PUBLIC_SITE_URL=https://lajerga.app
ENV NEXT_PUBLIC_ADSENSE_ID=ca-pub-1321706024272690
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
