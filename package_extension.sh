#!/bin/bash

# Set the name of the ZIP file
ZIP_NAME="selectivecleaner.zip"

# Set the directory of your Chrome extension (default: current directory)
EXTENSION_DIR="$(pwd)"

# List of files and directories to exclude
EXCLUDES=(
  ".git"
  ".gitignore"
  "README.md"
  "package.json"
  "package-lock.json"
  "node_modules"
  ".DS_Store"
)

# Create the exclusion string for zip command
EXCLUDE_STRING=""
for EXCLUDE in "${EXCLUDES[@]}"; do
  EXCLUDE_STRING+=" --exclude=$EXCLUDE"
done

# Remove existing zip file if it exists
if [ -f "$ZIP_NAME" ]; then
  echo "Removing old zip file: $ZIP_NAME"
  rm "$ZIP_NAME"
fi

# Create the zip file excluding specified files and directories
echo "Creating ZIP archive: $ZIP_NAME"
zip -r "$ZIP_NAME" . $EXCLUDE_STRING > /dev/null

# Check if the zip was created successfully
if [ $? -eq 0 ]; then
  echo "Extension packaged successfully: $ZIP_NAME"
else
  echo "Error creating ZIP file!"
  exit 1
fi
