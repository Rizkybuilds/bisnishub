import {
  getPreviewProductBySlug,
  formatIllustrativePrice,
  type PreviewProduct,
  type PreviewGarmentColor,
  type PreviewSize,
  type PreviewPrintTone,
} from '../../data/products';
import type {
  AddDemoItemPayload,
  DemoCartAction,
  DemoCartActionResult,
  DemoCartLine,
  DemoCartState,
  DemoCartSummary,
  DemoGarmentColorId,
  DemoPrintToneId,
  DemoSize,
} from './types';

export const INITIAL_DEMO_CART_STATE: DemoCartState = {
  lines: [],
  isSimulationCompleted: false,
  lastActionNotice: undefined,
  lastActionResult: undefined,
};

export const MAX_LINE_QUANTITY = 10;
export const MIN_LINE_QUANTITY = 1;

/**
 * Validates product and selected variants against static preview fixtures.
 * Returns a fully hydrated DemoCartLine or undefined if validation fails.
 */
export function validateAndBuildDemoLine(
  productSlug: string,
  colorId: string,
  size: string,
  printToneId: string,
  quantity = 1,
): DemoCartLine | undefined {
  if (
    typeof quantity !== 'number' ||
    !Number.isFinite(quantity) ||
    !Number.isInteger(quantity) ||
    quantity < MIN_LINE_QUANTITY ||
    quantity > MAX_LINE_QUANTITY
  ) {
    return undefined;
  }

  const product: PreviewProduct | undefined =
    getPreviewProductBySlug(productSlug);
  if (!product) {
    return undefined;
  }

  const color: PreviewGarmentColor | undefined = product.previewColors.find(
    (c) => c.id === colorId,
  );
  if (!color) {
    return undefined;
  }

  const validSize: PreviewSize | undefined = product.previewSizes.find(
    (s) => s === size,
  );
  if (!validSize) {
    return undefined;
  }

  const printTone: PreviewPrintTone | undefined =
    product.previewPrintTones.find((t) => t.id === printToneId);
  if (!printTone) {
    return undefined;
  }

  const compositeId = `${product.slug}::${color.id}::${validSize}::${printTone.id}`;

  return {
    id: compositeId,
    productSlug: product.slug,
    productTitle: product.title,
    series: product.series,
    palette: product.palette,
    motif: product.motif,
    colorId: color.id as DemoGarmentColorId,
    colorName: color.name,
    colorTone: color.tone,
    size: validSize as DemoSize,
    printToneId: printTone.id as DemoPrintToneId,
    printToneName: printTone.name,
    unitPriceIdr: product.illustrativePriceIdr,
    quantity,
  };
}

/**
 * Single source of truth for validating adding an item to the demo cart.
 * Pure function evaluating against current state and static catalog fixtures.
 */
export function validateAddDemoCartItem(
  state: DemoCartState,
  payload: AddDemoItemPayload,
): DemoCartActionResult {
  const quantity = payload.quantity ?? 1;

  // 1. Quantity validation: must be finite integer within bounds [1, 10]
  if (
    typeof quantity !== 'number' ||
    !Number.isFinite(quantity) ||
    !Number.isInteger(quantity) ||
    quantity < MIN_LINE_QUANTITY ||
    quantity > MAX_LINE_QUANTITY
  ) {
    return {
      success: false,
      reason: 'INVALID_QUANTITY',
      error:
        'Jumlah produk tidak valid. Harus berupa angka bulat antara 1 dan 10.',
    };
  }

  // 2. Product validation: must match approved static preview study fixture
  const product = getPreviewProductBySlug(payload.productSlug);
  if (!product) {
    return {
      success: false,
      reason: 'INVALID_PRODUCT',
      error: 'Gagal menambahkan item: produk studi desain tidak ditemukan.',
    };
  }

  // 3. Variant validations: color, size, and print tone
  const color = product.previewColors.find((c) => c.id === payload.colorId);
  if (!color) {
    return {
      success: false,
      reason: 'INVALID_VARIANT',
      error: 'Gagal menambahkan item: pilihan warna garmen tidak valid.',
    };
  }

  const validSize = product.previewSizes.find((s) => s === payload.size);
  if (!validSize) {
    return {
      success: false,
      reason: 'INVALID_VARIANT',
      error: 'Gagal menambahkan item: pilihan ukuran garmen tidak valid.',
    };
  }

  const printTone = product.previewPrintTones.find(
    (t) => t.id === payload.printToneId,
  );
  if (!printTone) {
    return {
      success: false,
      reason: 'INVALID_VARIANT',
      error: 'Gagal menambahkan item: karakteristik cetak tidak valid.',
    };
  }

  const compositeId = `${product.slug}::${color.id}::${validSize}::${printTone.id}`;
  const existingLine = state.lines.find((l) => l.id === compositeId);

  if (existingLine) {
    const resultingQty = existingLine.quantity + quantity;
    if (resultingQty > MAX_LINE_QUANTITY) {
      return {
        success: false,
        reason: 'MAX_QUANTITY_EXCEEDED',
        error: `Jumlah maksimum (${MAX_LINE_QUANTITY} pcs) tercapai untuk varian ini di keranjang simulasi.`,
      };
    }

    return {
      success: true,
      notice: `Jumlah ${product.title} (${color.name}, ${validSize}) diperbarui menjadi ${resultingQty} di keranjang simulasi.`,
      line: {
        ...existingLine,
        quantity: resultingQty,
      },
      isNew: false,
      newQuantity: resultingQty,
    };
  }

  const newLine: DemoCartLine = {
    id: compositeId,
    productSlug: product.slug,
    productTitle: product.title,
    series: product.series,
    palette: product.palette,
    motif: product.motif,
    colorId: color.id as DemoGarmentColorId,
    colorName: color.name,
    colorTone: color.tone,
    size: validSize as DemoSize,
    printToneId: printTone.id as DemoPrintToneId,
    printToneName: printTone.name,
    unitPriceIdr: product.illustrativePriceIdr,
    quantity,
  };

  return {
    success: true,
    notice: `${product.title} (${color.name}, ${validSize}) ditambahkan ke keranjang simulasi.`,
    line: newLine,
    isNew: true,
    newQuantity: quantity,
  };
}

/**
 * Calculates total quantity and illustrative subtotal from cart lines.
 * Strictly demonstrative: no taxes, shipping, or discounts calculated.
 */
export function calculateDemoCartSummary(
  lines: readonly DemoCartLine[],
): DemoCartSummary {
  let totalQuantity = 0;
  let illustrativeSubtotalIdr = 0;

  for (const line of lines) {
    totalQuantity += line.quantity;
    illustrativeSubtotalIdr += line.unitPriceIdr * line.quantity;
  }

  return {
    totalQuantity,
    illustrativeSubtotalIdr,
    formattedIllustrativeSubtotal: formatIllustrativePrice(
      illustrativeSubtotalIdr,
    ),
    isEmpty: lines.length === 0,
  };
}

/**
 * Pure, deterministic reducer managing demo commerce cart transitions.
 * Ensures all cart-modifying actions invalidate completion state.
 */
export function demoCartReducer(
  state: DemoCartState,
  action: DemoCartAction,
): DemoCartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const result = validateAddDemoCartItem(state, action.payload);
      if (!result.success) {
        return {
          ...state,
          lastActionNotice: result.error,
          lastActionResult: result,
        };
      }

      if (result.isNew) {
        return {
          ...state,
          lines: [...state.lines, result.line],
          isSimulationCompleted: false, // Invalidate completed simulation on accepted mutation
          lastActionNotice: result.notice,
          lastActionResult: result,
        };
      }

      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === result.line.id ? result.line : l,
        ),
        isSimulationCompleted: false, // Invalidate completed simulation on accepted mutation
        lastActionNotice: result.notice,
        lastActionResult: result,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { lineId, quantity } = action.payload;

      // Reject non-integer, non-finite, or out of bounds (1..10). Do not clamp, do not remove on 0.
      if (
        typeof quantity !== 'number' ||
        !Number.isFinite(quantity) ||
        !Number.isInteger(quantity) ||
        quantity < MIN_LINE_QUANTITY ||
        quantity > MAX_LINE_QUANTITY
      ) {
        return {
          ...state,
          lastActionNotice:
            'Jumlah produk tidak valid. Harus berupa angka bulat antara 1 dan 10.',
          lastActionResult: {
            success: false,
            reason: 'INVALID_QUANTITY',
            error:
              'Jumlah produk tidak valid. Harus berupa angka bulat antara 1 dan 10.',
          },
        };
      }

      const target = state.lines.find((l) => l.id === lineId);
      if (!target) return state;

      // If unchanged, do not mutate
      if (target.quantity === quantity) {
        return state;
      }

      const updatedLine: DemoCartLine = { ...target, quantity };
      return {
        ...state,
        lines: state.lines.map((l) => (l.id === lineId ? updatedLine : l)),
        isSimulationCompleted: false, // Invalidate completed simulation on accepted mutation
        lastActionNotice: `Jumlah ${target.productTitle} diubah menjadi ${quantity}.`,
        lastActionResult: {
          success: true,
          notice: `Jumlah ${target.productTitle} diubah menjadi ${quantity}.`,
          line: updatedLine,
          isNew: false,
          newQuantity: quantity,
        },
      };
    }

    case 'REMOVE_ITEM': {
      const target = state.lines.find((l) => l.id === action.payload.lineId);
      if (!target) return state;

      return {
        ...state,
        lines: state.lines.filter((l) => l.id !== action.payload.lineId),
        isSimulationCompleted: false, // Invalidate completed simulation on accepted mutation
        lastActionNotice: `${target.productTitle} (${target.colorName}, ${target.size}) dihapus dari keranjang simulasi.`,
        lastActionResult: {
          success: true,
          notice: `${target.productTitle} dihapus dari keranjang simulasi.`,
          line: target,
          isNew: false,
          newQuantity: 0,
        },
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        lines: [],
        isSimulationCompleted: false, // Invalidate completed simulation on accepted mutation
        lastActionNotice: 'Keranjang simulasi telah dikosongkan.',
        lastActionResult: undefined,
      };
    }

    case 'COMPLETE_SIMULATION': {
      // Must have at least one line to complete simulation
      if (state.lines.length === 0) {
        return {
          ...state,
          isSimulationCompleted: false,
          lastActionNotice:
            'Gagal menyelesaikan simulasi: keranjang simulasi kosong.',
          lastActionResult: {
            success: false,
            reason: 'INVALID_QUANTITY',
            error: 'Keranjang belanja kosong.',
          },
        };
      }

      return {
        ...state,
        isSimulationCompleted: true,
        lastActionNotice:
          'Simulasi checkout selesai. Tidak ada transaksi riil yang dibuat.',
        lastActionResult: {
          success: true,
          notice: 'Simulasi checkout selesai.',
          line: state.lines[0]!,
          isNew: false,
          newQuantity: state.lines.length,
        },
      };
    }

    case 'RESET_SIMULATION': {
      return {
        ...INITIAL_DEMO_CART_STATE,
        lastActionNotice: 'Simulasi demo telah diatur ulang.',
      };
    }

    default:
      return state;
  }
}
