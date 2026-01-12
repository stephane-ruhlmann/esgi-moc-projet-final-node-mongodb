/**
 * Script: db:reset
 *
 * Vide toutes les collections de la base de données.
 * Utile pour repartir d'un état propre pendant le développement.
 *
 * Usage:
 *   pnpm db:reset
 *
 * Environnement:
 *   MONGODB_URI - URI de connexion MongoDB (défaut: mongodb://localhost:27017/iot_monitoring)
 */

import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/iot_monitoring";

const main = async () => {
  console.log("🗑️  Réinitialisation de la base de données...\n");

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log("ℹ️  Aucune collection trouvée, la base est déjà vide.");
      return;
    }

    for (const collection of collections) {
      const result = await db.collection(collection.name).deleteMany({});
      console.log(
        `   ✓ ${collection.name}: ${result.deletedCount} document(s) supprimé(s)`
      );
    }

    console.log("\n✅ Base de données vidée avec succès.");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Erreur: ${error.message}`);
    } else {
      console.error("❌ Erreur inconnue");
    }
    process.exit(1);
  } finally {
    await client.close();
  }
};

main();
