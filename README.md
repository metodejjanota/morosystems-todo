# morosystems-todo

## Technologie

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit (RTK, RTK Query)
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

### Backend

- Přidán jako Git submodule z repozitáře [morosystems/todo-be](https://github.com/morosystems/todo-be)

## URL aplikace

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## Spuštění

### Frontend

```bash
cd frontend
pnpm i
pnpm run dev
```

### Backend

```bash
cd backend
pnpm i
pnpm start
```

## Poznámka

Endpoint GET /tasks/completed jsem nevyužil, protože mi přišlo lepší většinu věcí, které to umožňují (např. filtrování), řešit přímo na klientovi a tím nezatěžovat backend zbytečnými reloady a requesty
