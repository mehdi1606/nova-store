import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink/55 hover:text-ink">
        ← Tous les produits
      </Link>
      <h1 className="mt-4 font-display text-3xl font-[380]">Nouveau produit</h1>
      <p className="mt-2 max-w-prose text-ink/60">
        Ajoutez une pièce à la boutique avec ses propres photos. Vos trois pièces
        existantes ne changent pas.
      </p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
