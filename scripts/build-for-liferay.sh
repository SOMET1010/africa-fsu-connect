
#!/bin/bash

echo "Building React app for Liferay..."

# Build avec la configuration Liferay
npm run build:liferay

# Copier les assets CSS
mkdir -p modules/react-sutel-portlet/src/main/resources/META-INF/resources/css/
cp dist/style.css modules/react-sutel-portlet/src/main/resources/META-INF/resources/css/main.css 2>/dev/null || true

echo "Build completed!"
echo "Files generated in modules/react-sutel-portlet/src/main/resources/META-INF/resources/"
