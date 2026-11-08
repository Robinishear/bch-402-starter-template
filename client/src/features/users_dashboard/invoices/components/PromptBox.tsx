import { Props } from "../_core/invoices.interface";

const MAX = 500;

export default function PromptBox({ value, onChange, disabled }: Props) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={MAX}
        rows={6}
        placeholder="Type your question or text here..."
        className="w-full rounded-lg border bg-transparent p-3"
      />
      <p className="mt-1 text-right text-xs text-gray-400">
        {value.length}/{MAX}
      </p>
    </div>
  );
}