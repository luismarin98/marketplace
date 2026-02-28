import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { getCollection } from "@/lib/mongodb";
import { USERS_COLLECTION } from "@/modules/auth/domain/user.entity";
import { PRODUCTS_COLLECTION } from "@/modules/product/domain/product.entity";

export default async function HomePage() {
  const usersCollection = await getCollection(USERS_COLLECTION);
  const productsCollection = await getCollection(PRODUCTS_COLLECTION);

  const sellerCount = await usersCollection.countDocuments({ role: "seller" });
  const productCount = await productsCollection.countDocuments();

  return (
    <main>
      <HeroSection sellerCount={sellerCount} productCount={productCount} />
      <FeaturesSection />
    </main>
  );
}
