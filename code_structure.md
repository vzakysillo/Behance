## Code Structure & Architecture

---

### Backend

- Layered architecture — requests flow Routes → Controllers → Services → Models, never skipping a layer
- Each layer has one responsibility:
  - Routes — only declare HTTP endpoints
  - Controllers — extract input, format responses
  - Services — business logic + database operations
  - Models — data structure
- Unidirectional dependencies — each layer only knows the layer below it
- Benefits:
  - Business logic is fully isolated from HTTP concerns
  - The same service is reusable by any endpoint
  - Changes never ripple across layers
  - Every layer is independently testable
- Centralized error handling — one middleware + custom exception hierarchy → consistent error behavior across the whole API

---

### Frontend

- Three-tier component hierarchy: UI primitives → feature components → page components
- Single dependency direction — pages compose features, features compose UI primitives
- One Axios instance with interceptors — every request, token, and error passes through the same choke points
- State separation:
  - Server state → TanStack React Query (cache, invalidation, re-sync)
  - Global auth state → single context provider at the root
  - Local UI state → stays inside components
- Benefits:
  - Pages are built from existing primitives without duplication
  - One source of truth for state
  - Predictable data flow — every request and error handled in one place
  - Reusable, consistent components
