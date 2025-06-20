SQL **window functions** let you perform calculations across a set of table rows that are somehow related to the current row. These powerful functions enable you to perform complex analytical queries without the need for self-joins or subqueries.

## When to Use Window Functions

- Running totals and cumulative sums
- Ranking (ROW_NUMBER, RANK, DENSE_RANK)
- Moving averages and sliding windows
- Percentile calculations
- Lead and lag analysis
- Partitioned aggregations

## Basic Syntax

The general syntax for window functions is:
```sql
function_name() OVER (
  [PARTITION BY column1, column2, ...]
  [ORDER BY column1 [ASC|DESC], column2 [ASC|DESC], ...]
  [ROWS|RANGE frame_clause]
)
```

## Common Window Functions

### Ranking Functions
```sql
SELECT
  employee_id,
  department,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rank
FROM employees;
```

### Aggregate Functions
```sql
SELECT
  employee_id,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) AS avg_dep_salary,
  SUM(salary) OVER (PARTITION BY department) AS total_dep_salary,
  COUNT(*) OVER (PARTITION BY department) AS dept_employee_count
FROM employees;
```

### Frame Clauses

| Keyword | Meaning | Use Case |
|---------|---------|----------|
| `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` | cumulative total | Running totals |
| `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` | 3‑row window | Moving averages |
| `ROWS BETWEEN 5 PRECEDING AND CURRENT ROW` | 6‑row window | 6‑period moving average |
| `ROWS UNBOUNDED PRECEDING` | all previous rows | Cumulative sum |

## Advanced Examples

### Moving Average
```sql
SELECT
  date,
  sales_amount,
  AVG(sales_amount) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7_days
FROM daily_sales;
```

### Lead and Lag
```sql
SELECT
  employee_id,
  hire_date,
  LAG(hire_date, 1) OVER (ORDER BY hire_date) AS previous_hire,
  LEAD(hire_date, 1) OVER (ORDER BY hire_date) AS next_hire
FROM employees;
```

### Percentile Ranking
```sql
SELECT
  employee_id,
  salary,
  PERCENT_RANK() OVER (ORDER BY salary) AS salary_percentile,
  NTILE(4) OVER (ORDER BY salary) AS salary_quartile
FROM employees;
```

## Performance Considerations

- Window functions are generally more efficient than self-joins
- Use appropriate indexes on PARTITION BY and ORDER BY columns
- Consider the frame size for moving calculations
- Window functions execute after WHERE but before ORDER BY

> **Tip:** Window functions run **after** WHERE but **before** ORDER BY in the logical query order.

## Common Pitfalls

1. **Forgetting PARTITION BY**: Results in global calculations
2. **Incorrect frame specification**: Can lead to unexpected results
3. **Performance with large datasets**: Large windows can be slow
4. **NULL handling**: NULL values can affect ordering and partitioning

## Best Practices

- Always specify ORDER BY for deterministic results
- Use meaningful partition columns
- Consider the business logic when choosing frame clauses
- Test with edge cases (empty partitions, NULL values)
- Monitor performance with large datasets

---

_Last updated: 2025‑06‑19_
