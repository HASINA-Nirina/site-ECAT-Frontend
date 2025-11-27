#!/bin/sh

# Exporter les variables pour qu'elles soient prises en compte
export NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}


echo "✅ Environnement chargé avec les valeurs suivantes :"
echo "NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}"


# Lancer Next.js
npx next start -p 3149