#!/bin/bash

set -o errexit

readonly REQUIRED_ENV_VARS=(
  "COLORS_USER"
  "COLORS_PASSWORD"
  "COLORS_DATABASE"
)

check_env_vars_set() {
  for required_env_var in ${REQUIRED_ENV_VARS[@]}; do
    if [[ -z "${!required_env_var}" ]]; then
      echo "Error: Environment variable '$required_env_var' not set.
        Make sure you have the following environment variables set: ${REQUIRED_ENV_VARS[@]}"
      exit 1
    fi
  done
}

init_user_and_db() {
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $COLORS_DATABASE;

    \c $COLORS_DATABASE

    CREATE SEQUENCE colors_id_seq;

    CREATE TABLE colors_hex (
      id integer PRIMARY KEY DEFAULT nextval('colors_id_seq'),
      color VARCHAR(1024) NOT NULL,
      hex VARCHAR(1024) NOT NULL
    );

    CREATE INDEX ON colors_hex (id ASC);

    CREATE USER $COLORS_USER WITH PASSWORD '$COLORS_PASSWORD';

    GRANT SELECT,USAGE ON SEQUENCE colors_id_seq TO $COLORS_USER;

    GRANT SELECT,INSERT,UPDATE ON TABLE colors_hex TO $COLORS_USER;
EOSQL
}

main() {
  check_env_vars_set
  init_user_and_db
}

main "$@"
