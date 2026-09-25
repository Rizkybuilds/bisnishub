'use client';

import { startTransition, useActionState, useRef, useEffect } from 'react';
import {
  transitionProductionJobAction,
  ProductionActionResult,
} from './actions';

export function JobTransitionButton({
  jobId,
  toStatus,
  label,
  variant = 'primary',
  confirmPrompt,
}: {
  jobId: string;
  toStatus: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  confirmPrompt?: string;
}) {
  const [state, action, pending] = useActionState(
    async (
      _prev: ProductionActionResult,
      formData: FormData,
    ): Promise<ProductionActionResult> => {
      const reason = String(formData.get('reason') ?? '').trim();
      return transitionProductionJobAction({
        jobId,
        toStatus,
        reason: reason || null,
      });
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  const btnClass =
    variant === 'danger'
      ? 'btn-danger'
      : variant === 'secondary'
        ? 'btn-secondary'
        : 'btn-primary';

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirmPrompt && !window.confirm(confirmPrompt)) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      style={{ display: 'inline-block', margin: '2px' }}
    >
      <input type="hidden" name="toStatus" value={toStatus} />
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
        className={btnClass}
        disabled={pending}
        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
      >
        {pending ? 'Memproses…' : label}
      </button>
    </form>
  );
}
