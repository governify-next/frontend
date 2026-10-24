import { Page } from "./page";
import { PageHeader } from "./page-header";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

export function ListPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Page
      breadcrumb={
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <PageHeader title={title} description={description} actions={actions} />
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </Page>
  );
}
