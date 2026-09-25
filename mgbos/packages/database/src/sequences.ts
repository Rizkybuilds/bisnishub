export interface DocumentNumberServiceConfig {
  supabaseUrl: string;
  apiKey: string;
}

export interface GenerateDocumentNumberParams {
  organizationId: string;
  brandId: string;
  documentType: string;
  year?: number;
  padLength?: number;
}

export interface NextDocumentSequenceParams {
  organizationId: string;
  brandId: string;
  documentType: string;
  year?: number;
}

/**
 * Requests the next atomic increment sequence number from PostgreSQL.
 */
export async function requestNextDocumentSequence(
  config: DocumentNumberServiceConfig,
  params: NextDocumentSequenceParams,
): Promise<number> {
  const url = `${config.supabaseUrl.replace(/\/+$/, '')}/rest/v1/rpc/next_document_sequence`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: config.apiKey,
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Content-Profile': 'app',
    },
    body: JSON.stringify({
      p_organization_id: params.organizationId,
      p_brand_id: params.brandId,
      p_document_type: params.documentType,
      p_year: params.year ?? new Date().getFullYear(),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to generate sequence: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const result = (await response.json()) as number;
  return result;
}

/**
 * Requests a formatted, collision-safe canonical document number ({BRAND}-{TYPE}-{YEAR}-{SEQUENCE}) from PostgreSQL.
 */
export async function requestGenerateDocumentNumber(
  config: DocumentNumberServiceConfig,
  params: GenerateDocumentNumberParams,
): Promise<string> {
  const url = `${config.supabaseUrl.replace(/\/+$/, '')}/rest/v1/rpc/generate_document_number`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: config.apiKey,
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Content-Profile': 'app',
    },
    body: JSON.stringify({
      p_organization_id: params.organizationId,
      p_brand_id: params.brandId,
      p_document_type: params.documentType,
      p_year: params.year ?? new Date().getFullYear(),
      p_pad_length: params.padLength ?? 6,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to generate document number: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const result = (await response.json()) as string;
  return result;
}
