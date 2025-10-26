import { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralInfoTab } from '@/components/company/GeneralInfoTab';
import { CertificationsTab } from '@/components/company/CertificationsTab';
import { LegalDocumentsTab } from '@/components/company/LegalDocumentsTab';
import { BillingTab } from '@/components/company/BillingTab';
import { AuditTab } from '@/components/company/AuditTab';
import { Building2, FileCheck, FileText, Receipt, History } from 'lucide-react';

export default function CompanySettings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              Configuración de Empresa
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestiona la información, certificaciones y documentación de tu empresa
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Información General</span>
                <span className="sm:hidden">General</span>
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Certificaciones</span>
                <span className="sm:hidden">Cert.</span>
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documentación Legal</span>
                <span className="sm:hidden">Legal</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Facturación</span>
                <span className="sm:hidden">Fact.</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Auditoría</span>
                <span className="sm:hidden">Audit.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralInfoTab />
            </TabsContent>

            <TabsContent value="certifications">
              <CertificationsTab />
            </TabsContent>

            <TabsContent value="legal">
              <LegalDocumentsTab />
            </TabsContent>

            <TabsContent value="billing">
              <BillingTab />
            </TabsContent>

            <TabsContent value="audit">
              <AuditTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
