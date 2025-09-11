'use client';

import * as React from 'react';
import { useState } from 'react';
import { useActionState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { rootDomain } from '@/lib/utils';
import { createSubdomainRentalAction } from '@/lib/new-actions';

type RentalState = {
    error?: string;
    success?: boolean;
};

interface CalendarRentalFormProps {
    subdomain: string;
    icon: string;
    bookedDates: Date[];
}

export function CalendarRentalForm({
    subdomain,
    icon,
    bookedDates
}: CalendarRentalFormProps) {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const [state, action, isPending] = useActionState<RentalState, FormData>(
        createSubdomainRentalAction,
        {}
    );

    const handleSubmit = (formData: FormData) => {
        // Add subdomain and icon to form data
        formData.append('subdomain', subdomain);
        formData.append('icon', icon);

        // Add selected dates to form data
        selectedDates.forEach((date, index) => {
            formData.append(`dates[${index}]`, date.toISOString());
        });

        action(formData);
    };

    const totalCost = selectedDates.length * 10; // Assuming $10 per day

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label className="text-base font-medium">Available Dates</Label>
                        <p className="text-sm text-gray-500 mt-1">
                            Select the dates you want to rent. Crossed-out dates are already booked.
                        </p>
                    </div>

                    <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={setSelectedDates}
                        disabled={(date) =>
                            date <= new Date() || bookedDates.some(bookedDate =>
                                date.toDateString() === bookedDate.toDateString()
                            )
                        }
                        modifiers={{
                            booked: bookedDates,
                        }}
                        modifiersClassNames={{
                            booked: "[&>button]:line-through opacity-100",
                        }}
                        className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                        buttonVariant="ghost"
                    />
                </div>

                {selectedDates.length > 0 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium mb-3">Rental Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subdomain:</span>
                                    <span className="font-medium">
                                        {icon} {subdomain}.{rootDomain}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Selected dates:</span>
                                    <span className="font-medium">{selectedDates.length} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rate per day:</span>
                                    <span>$10</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-medium">
                                    <span>Total:</span>
                                    <span>${totalCost}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-md">
                            <p className="text-sm font-medium mb-2">Selected dates:</p>
                            <div className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                                {selectedDates
                                    .sort((a, b) => a.getTime() - b.getTime())
                                    .map((date, index) => (
                                        <div key={index}>{date.toLocaleDateString()}</div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {state?.error && (
                    <div className="text-sm text-red-500 p-3 bg-red-50 rounded-md">
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="text-sm text-green-600 p-3 bg-green-50 rounded-md">
                        Successfully rented {subdomain}.{rootDomain}!
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || selectedDates.length === 0}
                >
                    {isPending ? 'Processing...' : `Rent for $${totalCost} (${selectedDates.length} days)`}
                </Button>
            </form>
        </div>
    );
}