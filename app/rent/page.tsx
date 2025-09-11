'use client';

import type React from 'react';

import { useState } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Smile } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
  EmojiPickerFooter
} from '@/components/ui/emoji-picker';
import { rootDomain } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { checkSubdomainAvailabilityAction } from '@/lib/new-actions';

type CheckState = {
  error?: string;
  success?: boolean;
  subdomain?: string;
  icon?: string;
  available?: boolean;
};

function SubdomainInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="subdomain">Subdomain</Label>
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            id="subdomain"
            name="subdomain"
            placeholder="your-subdomain"
            defaultValue={defaultValue}
            className="w-full rounded-r-none focus:z-10"
            required
          />
        </div>
        <span className="bg-gray-100 px-3 border border-l-0 border-input rounded-r-md text-gray-500 min-h-[36px] flex items-center">
          .{rootDomain}
        </span>
      </div>
    </div>
  );
}

function IconPicker({
  icon,
  setIcon,
  defaultValue
}: {
  icon: string;
  setIcon: (icon: string) => void;
  defaultValue?: string;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleEmojiSelect = ({ emoji }: { emoji: string }) => {
    setIcon(emoji);
    setIsPickerOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="icon">Icon</Label>
      <div className="flex flex-col gap-2">
        <input type="hidden" name="icon" value={icon} required />
        <div className="flex items-center gap-2">
          <Card className="flex-1 flex flex-row items-center justify-between p-2 border border-input rounded-md">
            <div className="min-w-[40px] min-h-[40px] flex items-center pl-[14px] select-none">
              {icon ? (
                <span className="text-3xl">{icon}</span>
              ) : (
                <span className="text-gray-400 text-sm font-normal">
                  No icon selected
                </span>
              )}
            </div>
            <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-auto rounded-sm"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                >
                  <Smile className="h-4 w-4 mr-2" />
                  Select Emoji
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[256px]"
                align="end"
                sideOffset={5}
              >
                <EmojiPicker
                  className="h-[300px] w-[256px]"
                  defaultValue={defaultValue}
                  onEmojiSelect={handleEmojiSelect}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover>
          </Card>
        </div>
        <p className="text-xs text-gray-500">
          Select an emoji to represent your subdomain
        </p>
      </div>
    </div>
  );
}

export default function SubdomainSelectionForm() {
  const [icon, setIcon] = useState('');
  const router = useRouter();

  const [state, action, isPending] = useActionState<CheckState, FormData>(
    async (prevState: CheckState, formData: FormData) => {
      const result = await checkSubdomainAvailabilityAction(prevState, formData);
      
      // If subdomain is available, redirect to calendar page
      if (result.available) {
        const subdomain = formData.get('subdomain') as string;
        const icon = formData.get('icon') as string;
        
        router.push(`/rent/calendar?subdomain=${encodeURIComponent(subdomain)}&icon=${encodeURIComponent(icon)}`);
        return result;
      }
      
      return result;
    },
    {}
  );

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Choose Your Subdomain</h1>
        <p className="text-gray-600">
          Select a subdomain name and icon for your rental
        </p>
      </div>

      <form action={action} className="space-y-4">
        <SubdomainInput defaultValue={state?.subdomain} />

        <IconPicker icon={icon} setIcon={setIcon} defaultValue={state?.icon} />

        {state?.error && (
          <div className="text-sm text-red-500 p-3 bg-red-50 rounded-md">
            {state.error}
          </div>
        )}

        {state?.available && (
          <div className="text-sm text-green-600 p-3 bg-green-50 rounded-md">
            Great! "{state.subdomain}" is available. Redirecting to date selection...
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending || !icon}>
          {isPending ? 'Checking availability...' : 'Check Availability & Continue'}
        </Button>
      </form>
    </div>
  );
}