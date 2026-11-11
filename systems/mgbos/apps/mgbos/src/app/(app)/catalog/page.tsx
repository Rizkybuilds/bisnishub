import { listCatalogProducts } from './data';
import { CatalogManager } from './CatalogManager';
import './catalog.css';

export const metadata = {
  title: 'Product Catalog — TeeStock / MGBOS',
  description:
    'Kelola produk, varian, file mockup, dan status publikasi TeeStock.',
};

export default async function CatalogAdminPage() {
  const { products, base } = await listCatalogProducts();
  return <CatalogManager products={products} storageBase={base} />;
}
