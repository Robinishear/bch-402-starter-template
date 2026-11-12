"use client";

import Form from "next/form";
import Link from "next/link";

interface Option {
  value: string;
  label: string;
}

interface Props {
  action: string;
  placeholder: string;
  searchTerm?: string;
  status?: string;
  statusOptions?: Option[];
  keep?: Record<string, string | undefined>; 
}

const inputClass =
  "rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-500";

export default function SearchFilter({
  action,
  placeholder,
  searchTerm = "",
  status = "",
  statusOptions,
  keep = {},
}: Props) {
  const isActive = searchTerm !== "" || status !== "";
  const kept = Object.entries(keep).filter(([, value]) => value !== undefined && value !== "") as [string, string][];
  const clearHref = kept.length ? `${action}?${new URLSearchParams(kept).toString()}` : action;

  return (
    <Form action={action} className="flex flex-wrap items-center gap-2">
      {kept.map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <input
        key={searchTerm}
        name="searchTerm"
        defaultValue={searchTerm}
        placeholder={placeholder}
        className={`${inputClass} w-full sm:w-80`}
      />

      {statusOptions && (
        <select
          key={status}
          name="status"
          defaultValue={status}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className={inputClass}
        >
          <option value="">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      <button
        type="submit"
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
      >
        Search
      </button>

      {isActive && (
        <Link href={clearHref} className="text-sm text-gray-400 underline hover:text-white">
          Clear
        </Link>
      )}
    </Form>
  );
}