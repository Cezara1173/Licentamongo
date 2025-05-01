// update_products_with_artistID.js

db.products.updateOne(
    { name: "Valsul" },
    { $set: { artistId: ObjectId("6801fbb091c7f49d47e5c62e") } }
  );
  db.products.updateOne(
    { name: "Peisaj de toamna" },
    { $set: { artistId: ObjectId("6801fbb091c7f49d47e5c62f") } }
  );
  db.products.updateOne(
    { name: "Sideview Mirror" },
    { $set: { artistId: ObjectId("6801fbb091c7f49d47e5c630") } }
  );
  db.products.updateOne(
    { name: "Fereastra" },
    { $set: { artistId: ObjectId("6801fbb091c7f49d47e5c631") } }
  );
  db.products.updateOne(
    { name: "Magnolia" },
    { $set: { artistId: ObjectId("6801fbb091c7f49d47e5c632") } }
  );
  db.products.updateOne(
    { name: "Tenis woman" },
    { $set: { artistId: ObjectId("6801fbb091c7f49d47e5c633") } }
  );
  