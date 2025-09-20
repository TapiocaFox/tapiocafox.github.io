#!/bin/bash
function generate_uuid() {
    local N B C
    for (( N=0; N<16; N++ )); do
        B=$(printf '%02x' $(( RANDOM % 256 )))
        C="${C}${B}"
    done
    echo "${C:0:8}-${C:8:4}-${C:12:4}-${C:16:4}-${C:20:12}"
}

UUID_BASH=$(generate_uuid)

function generate_short_uuid() {
    local N B C
    for (( N=0; N<16; N++ )); do
        B=$(printf '%02x' $(( RANDOM % 256 )))
        C="${C}${B}"
    done
    echo "${C:0:8}"
}

SHORT_UUID_BASH=$(generate_short_uuid)

echo "export default 'Build. $SHORT_UUID_BASH';" > ./src/lib/version.ts
npm run build
touch ./docs/.nojekyll
touch ./docs/CNAME
echo "tapiocafox.com" > ./docs/CNAME