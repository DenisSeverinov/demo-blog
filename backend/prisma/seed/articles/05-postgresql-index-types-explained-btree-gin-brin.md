# PostgreSQL Index Types Explained: BTREE, GIN, BRIN

PostgreSQL ships with multiple index types, each optimized for specific query patterns. Understanding when to use each type can dramatically improve your database performance.

## Index Types Overview

| Type  | Ideal For | Notes | Size | Speed |
|-------|-----------|-------|------|-------|
| BTREE | Equality & range on sortable data | default | Medium | Fast |
| GIN   | Array containment, full‑text search | supports partial matches | Large | Very Fast |
| BRIN  | Very large, naturally ordered tables | tiny on disk | Tiny | Medium |
| HASH  | Equality only | deprecated in favor of BTREE | Medium | Fast |
| GiST  | Geometric data, custom types | extensible | Large | Medium |

## BTREE Indexes (Default)

### When to Use
- Primary keys and unique constraints
- Equality comparisons (`=`, `IN`)
- Range queries (`<`, `>`, `BETWEEN`)
- ORDER BY and GROUP BY operations

### Examples
```sql
-- Automatic BTREE index on primary key
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- BTREE index created automatically
  email VARCHAR(255) UNIQUE,  -- Another BTREE index
  created_at TIMESTAMP
);

-- Manual BTREE index
CREATE INDEX idx_users_created_at ON users(created_at);

-- Composite BTREE index
CREATE INDEX idx_users_email_created ON users(email, created_at);
```

## GIN Indexes (Generalized Inverted Index)

### When to Use
- Full-text search
- Array operations (`@>`, `&&`, `?`)
- JSONB queries
- Custom data types

### Examples
```sql
-- Full-text search
CREATE INDEX idx_articles_content_gin ON articles USING GIN (to_tsvector('english', content));

-- Array operations
CREATE INDEX idx_tags_gin ON articles USING GIN (tags);

-- JSONB indexing
CREATE INDEX idx_jsonb_tags ON articles USING GIN (tags jsonb_path_ops);
CREATE INDEX idx_jsonb_data ON articles USING GIN (data);

-- Query examples
SELECT * FROM articles WHERE tags @> ARRAY['postgresql'];
SELECT * FROM articles WHERE to_tsvector('english', content) @@ plainto_tsquery('postgresql');
SELECT * FROM articles WHERE data->>'category' = 'technology';
```

## BRIN Indexes (Block Range INdex)

### When to Use
- Very large tables (millions of rows)
- Naturally ordered data (timestamps, IDs)
- Sequential access patterns
- Limited disk space

### Examples
```sql
-- Time-series data
CREATE INDEX idx_logs_timestamp_brin ON logs USING BRIN (timestamp);

-- Large tables with natural ordering
CREATE INDEX idx_orders_id_brin ON orders USING BRIN (id);

-- Custom page range
CREATE INDEX idx_sensor_data_brin ON sensor_data USING BRIN (timestamp) WITH (pages_per_range = 128);
```

## Performance Comparison

### Query Performance
```sql
-- Test different index types
EXPLAIN ANALYZE SELECT * FROM articles WHERE tags @> ARRAY['postgresql'];
-- With GIN: ~1ms
-- With BTREE: ~50ms (if available)
-- Without index: ~500ms

EXPLAIN ANALYZE SELECT * FROM logs WHERE timestamp > '2024-01-01';
-- With BRIN: ~5ms
-- With BTREE: ~2ms
-- Without index: ~1000ms
```

### Storage Comparison
```sql
-- Check index sizes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

## Practical Tips

- Always examine `EXPLAIN ANALYZE` before and after adding indexes
- Combine partial indexes with BTREE for sparse columns
- BRIN shines on `timestamp` for time‑series data
- GIN indexes are larger but faster for complex queries
- Consider index maintenance overhead for write-heavy tables

## Advanced Techniques

### Partial Indexes
```sql
-- Index only active users
CREATE INDEX idx_users_active ON users(email) WHERE active = true;

-- Index only recent data
CREATE INDEX idx_logs_recent ON logs(timestamp) WHERE timestamp > '2024-01-01';
```

### Expression Indexes
```sql
-- Index on function result
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- Index on computed column
CREATE INDEX idx_articles_title_length ON articles(LENGTH(title));
```

### Concurrent Index Creation
```sql
-- Non-blocking index creation
CREATE INDEX CONCURRENTLY idx_large_table_column ON large_table(column);
```

## Monitoring and Maintenance

### Index Usage Statistics
```sql
-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Index Bloat
```sql
-- Check for index bloat
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  pg_size_pretty(pg_relation_size(indexrelid) - pg_relation_size(indexrelid)) as bloat_size
FROM pg_stat_user_indexes;
```

---

_Last updated: 2025‑06‑19_
