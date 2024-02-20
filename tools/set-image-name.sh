#!/bin/bash
IMAGE_NAME=$1
DEPLOYMENT_FILE=$2

# Check if the string is empty
if [[ -z "$IMAGE_NAME" ]]; then
    echo "Error: The image name is empty."
    exit 1
fi

if [[ -z "$DEPLOYMENT_FILE" ]]; then
    echo "Error: The deployment file name is empty."
    exit 1
fi

sed -i "s#^.*image:.*#          image: $IMAGE_NAME#" $DEPLOYMENT_FILE