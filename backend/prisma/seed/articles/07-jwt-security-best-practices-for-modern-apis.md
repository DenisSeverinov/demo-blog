JSON Web Tokens (JWT) power stateless authentication, but misuse can be catastrophic. Understanding proper JWT security practices is crucial for building robust, secure applications.

JWTs consist of three parts: header, payload, and signature. While they're convenient for stateless authentication, their security depends entirely on proper implementation and configuration.

## Checklist

- **Short TTL** for access tokens (`≤15 min`).
- Rotate **refresh tokens** on every use (ROTATE‑AND‑REVOKE).
- Sign with **RS256** instead of HS256 for multi‑service systems.
- Store tokens **httpOnly; SameSite=Lax** cookies when possible.

```ts
import jwt from 'jsonwebtoken';
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '10m' });
```

> Never put sensitive data (passwords, roles you don't want leaked) inside the JWT payload—it is only **Base64‑encoded**, not encrypted.

## Common Pitfalls to Avoid

1. **Long-lived tokens**: Always use short expiration times for access tokens
2. **Storing sensitive data**: JWT payload is base64-encoded, not encrypted
3. **Weak algorithms**: Use RS256 for asymmetric signing in production
4. **Client-side storage**: Prefer httpOnly cookies over localStorage
5. **Missing token validation**: Always verify signature and expiration

## Implementation Example

```typescript
// Token generation
const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_PRIVATE_KEY!,
    {
      algorithm: 'RS256',
      expiresIn: '10m',
      issuer: 'your-app',
      audience: 'your-app-users'
    }
  );
};

// Token verification
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
      algorithms: ['RS256'],
      issuer: 'your-app',
      audience: 'your-app-users'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

---

_Last updated: 2025‑06‑19_
