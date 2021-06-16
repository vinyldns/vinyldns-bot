#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Move to the docker folder
cd ${DIR}/../docker

# Perform test
echo Running tests
docker-compose -f ./docker-compose-test.yml up --build --exit-code-from vinyldns-bot-test --remove-orphans
test_status=$?
docker-compose -f ./docker-compose-test.yml down
if [[ ${test_status} -ne 0 ]]; then
  echo One or more tests failed
  exit ${test_status};
fi
echo All tests passed
