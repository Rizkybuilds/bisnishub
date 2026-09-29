'use client';

import { startTransition, useActionState, useRef, useEffect } from 'react';
import {
  issueInvoiceAction,
  voidInvoiceAction,
  InvoiceActionResult,
} from './actions';

export function IssueInvoiceButton({
  invoiceId,
  invoiceNumber,
}: {
  invoiceId: string;
  invoiceNumber: string;
}) {
  const [state, action, pending] = useActionState(
    async (prev: InvoiceActionResult): Promise<InvoiceActionResult> => {
      void prev;
      return issueInvoiceAction({ invoiceId });
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Terbitkan invoice resmi ${invoiceNumber}? Setelah diterbitkan, nilai finansial dan rekening akan dibekukan secara permanen.`,
          )
        ) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        startTransition(() => action());
      }}
      style={{ display: 'inline-block', margin: '2px' }}
    >
      {state.error && (
        <p
          role="alert"
          tabIndex={-1}
          ref={errorRef}
          className="error-banner"
          style={{ fontSize: '0.8rem', padding: '4px 8px' }}
        >
          {state.error}
        </p>
      )}
      <button
        className="btn-primary"
        disabled={pending}
        style={{ padding: '6px 14px', fontSize: '0.85rem' }}
      >
        {pending ? 'Menerbitkan…' : '🚀 Terbitkan Resmi (Issue Invoice)'}
      </button>
    </form>
  );
}

export function VoidInvoiceButton({
  invoiceId,
  invoiceNumber,
}: {
  invoiceId: string;
  invoiceNumber: string;
}) {
  const [state, action, pending] = useActionState(
    async (
      _prev: InvoiceActionResult,
      formData: FormData,
    ): Promise<InvoiceActionResult> => {
      const reason = String(formData.get('reason') ?? '').trim();
      return voidInvoiceAction({
        invoiceId,
        reason: reason || 'Pembatalan oleh otorisasi finance',
      });
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const reason = window.prompt(
          `Masukkan alasan pembatalan (VOID) invoice ${invoiceNumber}:`,
        );
        if (!reason || reason.trim().length < 3) {
          alert('Alasan pembatalan minimal 3 karakter.');
          e.preventDefault();
          return;
        }
        e.preventDefault();
        const data = new FormData();
        data.set('reason', reason.trim());
        startTransition(() => action(data));
      }}
      style={{ display: 'inline-block', margin: '2px' }}
    >
      {state.error && (
        <p
          role="alert"
          tabIndex={-1}
          ref={errorRef}
          className="error-banner"
          style={{ fontSize: '0.8rem', padding: '4px 8px' }}
        >
          {state.error}
        </p>
      )}
      <button
        className="btn-danger"
        disabled={pending}
        style={{ padding: '6px 14px', fontSize: '0.85rem' }}
      >
        {pending ? 'Membatalkan…' : '❌ Batalkan Faktur (VOID)'}
      </button>
    </form>
  );
}
