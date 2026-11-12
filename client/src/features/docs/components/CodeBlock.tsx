interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
      {language && (
        <div className="border-b border-white/10 px-3 py-1.5 text-xs uppercase tracking-wider text-gray-500">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-gray-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}