# LaJerga - Diccionario de Jergas Latinoamericanas

Diccionario colaborativo de jergas y modismos del español latinoamericano. Una PWA construida con Next.js 14, Supabase y Tailwind CSS.

**Dominio:** lajerga.app

## Stack tecnológico

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage)
- **Auth:** Google OAuth vía Supabase Auth
- **PWA:** next-pwa (manifest + service worker)

## Características

- Buscador de jergas por término
- Filtro por país (10 países latinoamericanos)
- Página de detalle con significado, ejemplo y votos
- Sistema de votos (thumbs up/down) sin necesidad de login
- Agregar jergas nuevas (requiere Google login)
- PWA instalable en dispositivos móviles
- SEO optimizado con meta tags y Open Graph
- Diseño mobile-first con tema oscuro y acentos violeta

## Setup

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd lajerga
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

3. Completa las variables con tus credenciales de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Crear tablas en Supabase

Ejecuta el archivo de migración en el SQL Editor de Supabase:

```bash
# Copia el contenido de supabase/migration.sql y ejecútalo en:
# Supabase Dashboard > SQL Editor > New query
```

### 4. Cargar datos iniciales

Ejecuta el seed con las 100 jergas iniciales:

```bash
# Copia el contenido de supabase/seed.sql y ejecútalo en:
# Supabase Dashboard > SQL Editor > New query
```

### 5. Configurar Google OAuth

1. Ve a Supabase Dashboard > Authentication > Providers
2. Habilita Google
3. Configura tu Google OAuth Client ID y Secret
4. Agrega `https://tu-proyecto.supabase.co/auth/v1/callback` como redirect URI en Google Cloud Console

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 7. Build de producción

```bash
npm run build
npm start
```

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/   # OAuth callback
│   │   ├── jergas/           # API de jergas
│   │   └── votar/            # API de votos
│   ├── agregar/              # Página para agregar jergas
│   ├── jerga/[id]/           # Página de detalle
│   ├── pais/[pais]/          # Filtro por país
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Página principal
│   ├── not-found.tsx         # Página 404
│   ├── sitemap.ts            # Sitemap dinámico
│   └── robots.ts             # robots.txt
├── components/
│   ├── Header.tsx            # Header con auth
│   ├── Footer.tsx            # Footer
│   ├── Buscador.tsx          # Buscador principal
│   ├── JergaCard.tsx         # Card de jerga
│   ├── BotonVoto.tsx         # Botón de voto
│   └── FiltroPaises.tsx      # Filtro por países
├── lib/
│   ├── supabase.ts           # Cliente Supabase (browser)
│   └── supabase-server.ts    # Cliente Supabase (server)
public/
├── manifest.json             # PWA manifest
└── icons/                    # Iconos PWA
supabase/
├── migration.sql             # Schema de la base de datos
└── seed.sql                  # 100 jergas iniciales
```

## Países incluidos

| País | Bandera | Jergas |
|------|---------|--------|
| Colombia | 🇨🇴 | 10 |
| México | 🇲🇽 | 10 |
| Argentina | 🇦🇷 | 10 |
| Venezuela | 🇻🇪 | 10 |
| Perú | 🇵🇪 | 10 |
| Chile | 🇨🇱 | 10 |
| Ecuador | 🇪🇨 | 10 |
| Costa Rica | 🇨🇷 | 10 |
| Cuba | 🇨🇺 | 10 |
| Rep. Dominicana | 🇩🇴 | 10 |
