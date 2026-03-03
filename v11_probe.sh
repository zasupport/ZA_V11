#!/bin/bash
# ZA Support V11 Diagnostic Satellite Module

get_serial() {
    ioreg -c IOPlatformExpertDevice -d 2 | awk -F\" '/IOPlatformSerialNumber/ {print $4}'
}

generate_v11_json() {
    local serial=$(get_serial)
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    echo "{"
    echo "  \"v11_metadata\": {"
    echo "    \"serial_number\": \"$serial\","
    echo "    \"timestamp\": \"$timestamp\","
    echo "    \"version\": \"3.0\""
    echo "  },"
    echo "  \"status\": \"ACTIVE\""
    echo "}"
}

# Run the generation immediately
generate_v11_json
