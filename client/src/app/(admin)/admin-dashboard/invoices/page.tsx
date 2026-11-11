import { InvoicePageProps } from "@/features/admin_dashboard/invoices/_core/invoice.interface";
import { InvoiceService } from "@/features/admin_dashboard/invoices/_core/invoice.service";
import InvoiceTable from "@/features/admin_dashboard/invoices/components/InvoiceTable";
import Pagination from "@/features/admin_dashboard/admin/components/Pagination";
import { PaginationProvider } from "@/components/ui/shared/pagination-provider";

function LoadError() {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
        Could not load invoices. Please refresh or login again.
      </div>
    </div>
  );
}

export default async function AdminInvoicesPage({ searchParams }: InvoicePageProps) {
  const params = await searchParams;

  const response = await InvoiceService.getAllInvoices(params).catch(() => null);
  if (!response) return <LoadError />;

  return (
    <div className="space-y-6 p-6">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Invoices</h1>
        <p className="mt-1.5 text-sm text-gray-400">Every payment request and its status.</p>
      </header>
<PaginationProvider>

      <InvoiceTable invoices={response.data} />
      {response.meta && <Pagination meta={response.meta} searchParams={params} label="invoices" />}
    </PaginationProvider>
    </div>
  );
}