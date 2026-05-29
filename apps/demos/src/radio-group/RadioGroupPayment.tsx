import { Label, RadioGroup, RadioGroupItem } from '@acronis-platform/shadcn-uikit/react'

export function RadioGroupPayment() {
  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <h4 className="font-semibold">Select Payment Method</h4>
      <RadioGroup defaultValue="credit-card">
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="credit-card" id="pay-credit" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="pay-credit">Credit Card</Label>
            <p className="text-sm text-muted-foreground">
              Pay with Visa, Mastercard, or American Express.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="paypal" id="pay-paypal" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="pay-paypal">PayPal</Label>
            <p className="text-sm text-muted-foreground">
              Pay securely using your PayPal account.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="bank-transfer" id="pay-bank" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="pay-bank">Bank Transfer</Label>
            <p className="text-sm text-muted-foreground">
              Direct transfer from your bank account.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
