#!/bin/bash

function generate {
    pandoc $1 -t html -o i1.html
    cat style.html i1.html > $2
    \rm i1.html
}

generate srs/srs.md srs.html
generate design/architecture.md design.html
