export type DemoSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type DemoGarmentColorId = 'forest-ink' | 'chalk-bone';

export type DemoPrintToneId = 'standard-screen' | 'vintage-wash';

export interface DemoCartLine {
  id: string; // Unique deterministic composite: `${productSlug}::${colorId}::${size}::${printToneId}`
  productSlug: string;
  productTitle: string;
  series: string;
  palette: string;
  motif: string;
  colorId: DemoGarmentColorId;
  colorName: string;
  colorTone: 'ink' | 'chalk';
  size: DemoSize;
  printToneId: DemoPrintToneId;
  printToneName: string;
  unitPriceIdr: number;
  quantity: number; // Integer between 1 and 10
}

export type DemoCartActionResult =
  | {
      success: true;
      notice: string;
      line: DemoCartLine;
      isNew: boolean;
      newQuantity: number;
    }
  | {
      success: false;
      error: string;
      reason:
        | 'INVALID_PRODUCT'
        | 'INVALID_VARIANT'
        | 'INVALID_QUANTITY'
        | 'MAX_QUANTITY_EXCEEDED';
    };

export interface DemoCartState {
  lines: readonly DemoCartLine[];
  isSimulationCompleted: boolean;
  lastActionNotice?: string;
  lastActionResult?: DemoCartActionResult;
}

export interface AddDemoItemPayload {
  productSlug: string;
  colorId: string;
  size: string;
  printToneId: string;
  quantity?: number;
}

export type DemoCartAction =
  | {
      type: 'ADD_ITEM';
      payload: AddDemoItemPayload;
    }
  | {
      type: 'UPDATE_QUANTITY';
      payload: {
        lineId: string;
        quantity: number;
      };
    }
  | {
      type: 'REMOVE_ITEM';
      payload: {
        lineId: string;
      };
    }
  | {
      type: 'CLEAR_CART';
    }
  | {
      type: 'COMPLETE_SIMULATION';
    }
  | {
      type: 'RESET_SIMULATION';
    };

export interface DemoCartSummary {
  totalQuantity: number;
  illustrativeSubtotalIdr: number;
  formattedIllustrativeSubtotal: string;
  isEmpty: boolean;
}
