import Image from 'next/image';
import Link from 'next/link';
import { fetchSearchSuggestions } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';

export default async function SearchSuggestions({
  query,
}: {
  query: string;
}) {
  const suggestions = await fetchSearchSuggestions(query);

  if (suggestions.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-gray-500">
        No results found for &ldquo;{query}&rdquo;
      </div>
    );
  }

  // Group by type
  const customers = suggestions.filter((s) => s.type === 'customer');
  const invoices = suggestions.filter((s) => s.type === 'invoice');

  return (
    <div className="max-h-72 overflow-y-auto">
      {customers.length > 0 && (
        <div>
          <div className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Customers
          </div>
          <ul className="px-2 pb-2">
            {customers.map((customer) => (
              <li key={`customer-${customer.id}`}>
                <Link
                  href={`/dashboard/customers`}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-blue-50"
                >
                  <Image
                    src={customer.image_url}
                    alt={`${customer.name}'s profile picture`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {customer.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {customer.email}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    Customer
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {invoices.length > 0 && (
        <div>
          <div className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Invoices
          </div>
          <ul className="px-2 pb-2">
            {invoices.map((invoice) => (
              <li key={`invoice-${invoice.id}`}>
                <Link
                  href={`/dashboard/invoices/${invoice.id}/edit`}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-blue-50"
                >
                  <Image
                    src={invoice.image_url}
                    alt={`${invoice.name}'s profile picture`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {invoice.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {invoice.amount != null && formatCurrency(invoice.amount)}
                      {' - '}
                      <span
                        className={
                          invoice.status === 'paid'
                            ? 'text-green-600'
                            : 'text-amber-600'
                        }
                      >
                        {invoice.status}
                      </span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                    Invoice
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
