# Interseed

Template from [Next Starter AI](https://nextstarter.ai/docs).


## Managing Supabase

```bash
npx supabase login

# Select the project
npx supabase link

# get cahnges from upstream
npx supabase pull

# reset the database (apply migrations and seed data)
npx supabase db reset

# Apply migrations to the database
npx supabase db push

# setup local environment 
npx supabase db start 

# get typescript types
npx supabase gen types --lang=typescript --local > types/supabase.ts
```
