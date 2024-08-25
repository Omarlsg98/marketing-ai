# Interseed

Template from [Next Starter AI](https://nextstarter.ai/docs).

## Getting Started

```bash
# Install dependencies
yarn install

# Run the development server
yarn run dev

# Build for production
yarn run build
```

## Managing Supabase

```bash
# login to supabase
npx supabase login

# init the project (do this only once)
npx supabase init

# create a migration
npx supabase migration new schema_test

# Select the project
npx supabase link

# get cahnges from upstream
npx supabase db pull

# reset the database (apply migrations and seed data)
npx supabase db reset

# Apply migrations to the database
npx supabase db push

# setup local environment 
npx supabase db start 

# get typescript types
npx supabase gen types --lang=typescript --local > types/supabase.ts
```
