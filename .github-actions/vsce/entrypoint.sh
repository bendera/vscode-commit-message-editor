#!/bin/sh

set -e

sh -c "yes | npx vsce@1 $*"
