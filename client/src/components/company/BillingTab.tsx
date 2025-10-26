import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, CreditCard, Building2 } from 'lucide-react';

export function BillingTab() {
  const [billingData, setBillingData] = useState({
    rut: '211234560018',
    legalName: 'Arrocera Los Pinos Sociedad Anónima',
    billingAddress: 'Ruta 8 Km 245, Treinta y Tres',
    paymentTerms: '30',
    bankName: 'Banco República',
    accountNumber: '001-123456-00001',
    accountType: 'corriente',
    swift: 'BROUUYMMXXX',
  });

  const handleSave = () => {
    alert('Información de facturación actualizada correctamente');
  };

  return (
    <div className="space-y-6">
      {/* Fiscal Data */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Fiscales</CardTitle>
          <CardDescription>
            Información para facturación y documentos tributarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                value={billingData.rut}
                onChange={(e) => setBillingData({ ...billingData, rut: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalName">Razón Social *</Label>
              <Input
                id="legalName"
                value={billingData.legalName}
                onChange={(e) => setBillingData({ ...billingData, legalName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress">Dirección de Facturación *</Label>
            <Input
              id="billingAddress"
              value={billingData.billingAddress}
              onChange={(e) => setBillingData({ ...billingData, billingAddress: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Condiciones de Pago (días) *</Label>
            <Select
              value={billingData.paymentTerms}
              onValueChange={(value) => setBillingData({ ...billingData, paymentTerms: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Contado</SelectItem>
                <SelectItem value="15">15 días</SelectItem>
                <SelectItem value="30">30 días</SelectItem>
                <SelectItem value="45">45 días</SelectItem>
                <SelectItem value="60">60 días</SelectItem>
                <SelectItem value="90">90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bank Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Información Bancaria
          </CardTitle>
          <CardDescription>
            Datos de cuentas bancarias para pagos y cobros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Banco *</Label>
              <Select
                value={billingData.bankName}
                onValueChange={(value) => setBillingData({ ...billingData, bankName: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Banco República">Banco República (BROU)</SelectItem>
                  <SelectItem value="Itaú">Itaú</SelectItem>
                  <SelectItem value="Santander">Santander</SelectItem>
                  <SelectItem value="BBVA">BBVA</SelectItem>
                  <SelectItem value="Scotiabank">Scotiabank</SelectItem>
                  <SelectItem value="Heritage">Heritage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Tipo de Cuenta *</Label>
              <Select
                value={billingData.accountType}
                onValueChange={(value) => setBillingData({ ...billingData, accountType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corriente">Cuenta Corriente</SelectItem>
                  <SelectItem value="ahorro">Caja de Ahorro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Número de Cuenta *</Label>
              <Input
                id="accountNumber"
                value={billingData.accountNumber}
                onChange={(e) => setBillingData({ ...billingData, accountNumber: e.target.value })}
                placeholder="001-123456-00001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="swift">Código SWIFT/BIC</Label>
              <Input
                id="swift"
                value={billingData.swift}
                onChange={(e) => setBillingData({ ...billingData, swift: e.target.value })}
                placeholder="BROUUYMMXXX"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-medium mb-1">ℹ️ Información</p>
            <p>Esta cuenta se utilizará para recibir pagos de clientes y realizar transferencias.</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Bank Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Cuentas Adicionales</CardTitle>
          <CardDescription>
            Puedes agregar múltiples cuentas bancarias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Building2 className="h-4 w-4 mr-2" />
            Agregar Cuenta Bancaria
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
