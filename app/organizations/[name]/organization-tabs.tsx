"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IOrganization } from "@/types/organization.types";

export function OrganizationTabs({
  organization,
}: {
  organization: IOrganization;
}) {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList variant="line" className="gap-6">
        <TabsTrigger value="home" className="text-base">
          Home
        </TabsTrigger>
        <TabsTrigger value="members" className="text-base">
          Members
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-base">
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="home" className="pt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">
            {organization.displayName || organization.name}
          </h2>
          {organization.description && (
            <p className="text-sm text-muted-foreground">
              {organization.description}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="members" className="pt-4">
        <p className="text-sm text-muted-foreground">Members - coming soon.</p>
      </TabsContent>

      <TabsContent value="settings" className="pt-4">
        <p className="text-sm text-muted-foreground">Settings — coming soon.</p>
      </TabsContent>
    </Tabs>
  );
}
