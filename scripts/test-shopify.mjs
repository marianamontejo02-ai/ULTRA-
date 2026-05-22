/**
 * Script de prueba de conexión con Shopify
 * Ejecutar: node scripts/test-shopify.mjs
 *
 * Asegúrate de tener .env.local configurado con:
 *   SHOPIFY_STORE_DOMAIN=ultra.com.co
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN=tu_token_aqui
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Leer .env.local manualmente
function loadEnv() {
  try {
    const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
    envFile.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...values] = trimmed.split('=');
      if (key && values.length) {
        process.env[key.trim()] = values.join('=').trim();
      }
    });
  } catch {
    console.error('❌ No se encontró .env.local');
    process.exit(1);
  }
}

loadEnv();

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !token || token === 'REEMPLAZAR_CON_STOREFRONT_TOKEN') {
  console.error('❌ Configura SHOPIFY_STORE_DOMAIN y SHOPIFY_STOREFRONT_ACCESS_TOKEN en .env.local');
  process.exit(1);
}

const QUERY = `{
  shop {
    name
    primaryDomain { url }
    currencyCode
    paymentSettings { currencyCode acceptedCardBrands }
  }
  collections(first: 5) {
    edges { node { title handle } }
  }
  products(first: 3) {
    edges { node { title handle availableForSale } }
  }
}`;

async function testConnection() {
  console.log(`\n🔌 Probando conexión con: ${domain}`);
  console.log(`🔑 Token: ${token.substring(0, 12)}...\n`);

  try {
    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query: QUERY }),
    });

    const status = res.status;

    if (status === 401) {
      console.error('❌ Token inválido o sin permisos.');
      console.log('\n📋 Pasos para solucionarlo:');
      console.log('   1. Ve a Shopify Admin > Apps > Develop apps');
      console.log('   2. Abre tu app (o crea una nueva)');
      console.log('   3. Ve a "API credentials" > "Storefront API"');
      console.log('   4. Activa los permisos unauthenticated_read_*');
      console.log('   5. Copia el Storefront API access token');
      console.log('   6. Actualiza .env.local con el nuevo token\n');
      return;
    }

    if (status === 403) {
      console.error('❌ Acceso denegado. El dominio o token no es correcto.');
      return;
    }

    if (!res.ok) {
      console.error(`❌ Error HTTP: ${status} ${res.statusText}`);
      const text = await res.text();
      console.error(text.substring(0, 500));
      return;
    }

    const json = await res.json();

    if (json.errors) {
      console.error('❌ Errores de GraphQL:');
      json.errors.forEach((e) => console.error(`   - ${e.message}`));
      return;
    }

    const { shop, collections, products } = json.data;

    console.log('✅ ¡Conexión exitosa!\n');
    console.log('🏪 Tienda:', shop.name);
    console.log('🌐 Dominio:', shop.primaryDomain.url);
    console.log('💵 Moneda:', shop.currencyCode);
    console.log('💳 Tarjetas:', shop.paymentSettings?.acceptedCardBrands?.join(', ') || 'N/A');

    console.log('\n📂 Colecciones encontradas:');
    collections.edges.forEach(({ node }) => {
      console.log(`   - ${node.title} (/${node.handle})`);
    });

    console.log('\n🛍️  Productos encontrados:');
    products.edges.forEach(({ node }) => {
      const stock = node.availableForSale ? '✅ En stock' : '⭕ Agotado';
      console.log(`   - ${node.title} ${stock}`);
    });

    console.log('\n🚀 Todo listo para iniciar el desarrollo!\n');
  } catch (err) {
    console.error('❌ Error de red:', err.message);
    console.log('\n💡 Verifica que el dominio "ultra.com.co" sea correcto.');
    console.log('   Si tu tienda usa *.myshopify.com, úsalo en SHOPIFY_STORE_DOMAIN.\n');
  }
}

testConnection();
