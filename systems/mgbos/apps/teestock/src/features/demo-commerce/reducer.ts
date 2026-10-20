import {
  getPreviewProductBySlug,
  formatIllustrativePrice,
  type PreviewProduct,
  type PreviewGarmentColor,
  type PreviewSize,
  type PreviewPrintTone,
} from '../../data/products';
import type {
  DemoCartAction,
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
 */
export function demoCartReducer(
  state: DemoCartState,
  action: DemoCartAction,
): DemoCartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const {
        productSlug,
        colorId,
        size,
        printToneId,
        quantity = 1,
      } = action.payload;

      const validated = validateAndBuildDemoLine(
        productSlug,
        colorId,
        size,
        printToneId,
        quantity,
      );

      if (!validated) {
        return {
          ...state,
          lastActionNotice:
            'Gagal menambahkan item: produk atau varian tidak valid.',
        };
      }

      const existingIndex = state.lines.findIndex((l) => l.id === validated.id);

      if (existingIndex >= 0) {
        // Consolidate identical line up to max quantity
        const existingLine = state.lines[existingIndex];
        if (!existingLine) return state;

        const newQty = Math.min(
          existingLine.quantity + validated.quantity,
          MAX_LINE_QUANTITY,
        );

        const updatedLines = [...state.lines];
        updatedLines[existingIndex] = {
          ...existingLine,
          quantity: newQty,
        };

        return {
          ...state,
          lines: updatedLines,
          isSimulationCompleted: false,
          lastActionNotice: `Jumlah ${validated.productTitle} (${validated.colorName}, ${validated.size}) diperbarui menjadi ${newQty} di keranjang simulasi.`,
        };
      }

      // Add as new distinct line
      return {
        ...state,
        lines: [...state.lines, validated],
        isSimulationCompleted: false,
        lastActionNotice: `${validated.productTitle} (${validated.colorName}, ${validated.size}) ditambahkan ke keranjang simulasi.`,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { lineId, quantity } = action.payload;

      if (!Number.isInteger(quantity) || quantity < 0) {
        return state;
      }

      if (quantity === 0) {
        const removed = state.lines.find((l) => l.id === lineId);
        return {
          ...state,
          lines: state.lines.filter((l) => l.id !== lineId),
          lastActionNotice: removed
            ? `${removed.productTitle} dihapus dari keranjang simulasi.`
            : state.lastActionNotice,
        };
      }

      const clampedQty = Math.min(quantity, MAX_LINE_QUANTITY);
      const target = state.lines.find((l) => l.id === lineId);
      if (!target) return state;

      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === lineId ? { ...l, quantity: clampedQty } : l,
        ),
        lastActionNotice: `Jumlah ${target.productTitle} diubah menjadi ${clampedQty}.`,
      };
    }

    case 'REMOVE_ITEM': {
      const target = state.lines.find((l) => l.id === action.payload.lineId);
      if (!target) return state;

      return {
        ...state,
        lines: state.lines.filter((l) => l.id !== action.payload.lineId),
        lastActionNotice: `${target.productTitle} (${target.colorName}, ${target.size}) dihapus dari keranjang simulasi.`,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        lines: [],
        lastActionNotice: 'Keranjang simulasi telah dikosongkan.',
      };
    }

    case 'COMPLETE_SIMULATION': {
      // Must have at least one line to complete simulation
      if (state.lines.length === 0) {
        return state;
      }

      return {
        ...state,
        isSimulationCompleted: true,
        lastActionNotice:
          'Simulasi checkout selesai. Tidak ada transaksi riil yang dibuat.',
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
