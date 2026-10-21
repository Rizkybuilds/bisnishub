# Concurrency Control, Deadlock Defense & Garment Inventory Allocation

> **Status:** `CANONICAL REFERENCE`  
> **Parent Skill:** [`integrated-erp-engine`](../SKILL.md)  
> **Target Environment:** MGBOS Core Domain, TeeStock Drops, PostgreSQL ACID  
> **Scope:** High-concurrency inventory reservation, deadlock prevention, and garment BOM allocation.

---

## 1. Proteksi Konkurensi Stok (Anti-Overselling)

Dalam penjualan flash drop (TeeStock) atau order B2B serentak (MultiGraph), beberapa pembeli akan mencoba membeli stok yang sama pada milidetik yang sama.

### 1.1 Pola Pengurangan Stok Tunggal Atomik (Single SKU)
Hindari pola `SELECT` terpisah jika hanya mengurangi stok satu item. Gunakan satu query atomik dengan klausa kondisi:

```sql
UPDATE inventory_items
SET stock_quantity = stock_quantity - $requested_qty,
    updated_at = NOW()
WHERE id = $item_id 
  AND stock_quantity >= $requested_qty
RETURNING id, stock_quantity;
```

**Evaluasi di Layer Aplikasi:**
```typescript
const result = await db.query(atomicDecrementQuery, [itemId, requestedQty]);

if (result.rowCount === 0) {
  // Stok tidak mencukupi atau record tidak ditemukan
  throw new InsufficientStockError(`Item ${itemId} out of stock or insufficient quantity.`);
}
```

---

## 2. Anti-Deadlock pada Transaksi Multi-Item (Keranjang Belanja)

### 2.1 Anatomi Deadlock
Jika Pembeli A membeli `[Item 1, Item 2]` dan Pembeli B membeli `[Item 2, Item 1]` secara bersamaan:
* Transaksi A mengunci `Item 1`, menunggu `Item 2`.
* Transaksi B mengunci `Item 2`, menunggu `Item 1`.
* **Terjadi Deadlock!** PostgreSQL akan me-rollback salah satu transaksi dengan error `deadlock detected`.

### 2.2 Aturan Emas: Deterministic Key Ordering
Setiap transaksi yang mengunci lebih dari satu baris **wajib mengurutkan ID item secara konsisten (misalnya ascending)** sebelum melakukan locking:

```typescript
export async function reserveCartItems(
  tx: DatabaseTransaction,
  cartItems: Array<{ itemId: string; quantity: number }>
): Promise<void> {
  // 1. URUTKAN ITEM SECARA DETERMINISTIK UNTUK MENCEGAH DEADLOCK
  const sortedItems = [...cartItems].sort((a, b) => a.itemId.localeCompare(b.itemId));
  const itemIds = sortedItems.map((i) => i.itemId);

  // 2. KUNCI SELURUH BARIS DALAM URUTAN ASCENDING
  const { rows: lockedRows } = await tx.query(
    `SELECT id, stock_quantity 
     FROM inventory_items 
     WHERE id = ANY($1) 
     ORDER BY id ASC 
     FOR UPDATE`,
    [itemIds]
  );

  // 3. VERIFIKASI KETERSEDIAAN SETIAP ITEM
  for (const requested of sortedItems) {
    const current = lockedRows.find((r) => r.id === requested.itemId);
    if (!current || current.stock_quantity < requested.quantity) {
      throw new InsufficientStockError(
        `Insufficient stock for item ${requested.itemId}. Requested: ${requested.quantity}`
      );
    }
  }

  // 4. POTONG STOK SECARA ATOMIK
  for (const requested of sortedItems) {
    await tx.query(
      `UPDATE inventory_items 
       SET stock_quantity = stock_quantity - $1, 
           updated_at = NOW() 
       WHERE id = $2`,
      [requested.quantity, requested.itemId]
    );
  }
}
```

---

## 3. Alokasi Inventori Garmen & Bill of Materials (BOM)

Di ekosistem garmen BisnisHub, inventori fisik dan produk katalog ritel memiliki pemisahan level:

```text
Katalog Display:     [Kaos Grafis Drop A - L]   [Kaos Grafis Drop B - L]
                                │                         │
                                └────────────┬────────────┘
                                             ▼
Fisik di Gudang:            [Blank Garment Cotton 16s Black - Size L]
```

### Aturan Alokasi:
1. **Decoupled SKU Reservation:** Mengurangi stok produk display (TeeStock Catalog) wajib memotong stok bahan baku fisik (*Blank Garment*) di gudang MGBOS melalui Bill of Materials (BOM).
2. **Buffer Scrap DTF:** Pengalokasian bahan cetak DTF wajib menyertakan margin toleransi scrap sablon minimal 5% pada order batch B2B.
3. **Integer Rupiah Finansial:** Seluruh perhitungan harga pokok, pemotongan stok, dan jurnal akuntansi wajib menggunakan bilangan bulat Rupiah (`BigInt`). Dilarang keras menggunakan tipe `float` atau `number` desimal untuk mata uang IDR.
