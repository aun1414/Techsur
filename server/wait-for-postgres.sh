#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

echo "🔐 Using SPRING_DATASOURCE_USERNAME: $SPRING_DATASOURCE_USERNAME"
echo "⏳ Waiting for PostgreSQL at $host..."

# Export password so psql can use it
export PGPASSWORD="$SPRING_DATASOURCE_PASSWORD"

until psql -h "$host" -U "$SPRING_DATASOURCE_USERNAME" -d techsurdb -c '\q' 2>/dev/null; do
  >&2 echo "Postgres is unavailable - sleeping..."
  sleep 2
done

>&2 echo "✅ Postgres is up - executing app command"
exec $cmd
