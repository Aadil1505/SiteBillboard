// components/editor/editor-interface.tsx
'use client';

import { useState, useActionState, SetStateAction } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateRentalContentAction } from '@/lib/new-actions';
import { rootDomain } from '@/lib/utils';

type Rental = {
  id: string;
  subdomain: string;
  emoji: string;
  content: string;
  dates: Date[];
};

type UpdateState = {
  success?: boolean;
  error?: string;
  message?: string;
};

interface EditorInterfaceProps {
  rentals: Rental[];
}

export function EditorInterface({ rentals }: EditorInterfaceProps) {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(
    rentals.length > 0 ? rentals[0] : null
  );
  const [content, setContent] = useState(selectedRental?.content || '');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  const [state, action, isPending] = useActionState<UpdateState, FormData>(
    updateRentalContentAction,
    {}
  );

  const handleRentalSelect = (rental: Rental) => {
    setSelectedRental(rental);
    setContent(rental.content);
    setPreviewMode('edit');
  };

  const handleSubmit = (formData: FormData) => {
    if (selectedRental) {
      formData.append('rentalId', selectedRental.id);
      formData.append('content', content);
      action(formData);
    }
  };

  if (!selectedRental) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Rentals List */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-lg font-semibold">Your Rentals</h2>
        <div className="space-y-2">
          {rentals.map((rental) => (
            <Card 
              key={rental.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedRental?.id === rental.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleRentalSelect(rental)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{rental.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{rental.subdomain}</p>
                    <p className="text-xs text-muted-foreground">
                      {rental.dates.length} day{rental.dates.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {rental.dates
                    .sort((a, b) => a.getTime() - b.getTime())
                    .slice(0, 3)
                    .map((date, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Badge>
                    ))}
                  {rental.dates.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{rental.dates.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedRental.emoji}</span>
                  {selectedRental.subdomain}.{rootDomain}
                </CardTitle>
                <CardDescription>
                  Edit the content that will be displayed on your subdomain
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://${selectedRental.subdomain}.${rootDomain}`, '_blank')}
              >
                Visit Site
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as 'edit' | 'preview')}>
              <TabsList>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4">
                <form action={handleSubmit} className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Enter your content here. You can use HTML tags for formatting..."
                      value={content}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) => setContent(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      You can use HTML tags for formatting. For example: &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                    </p>
                  </div>

                  {state?.error && (
                    <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-md">
                      {state.error}
                    </div>
                  )}

                  {state?.success && state?.message && (
                    <div className="text-sm text-green-600 p-3 bg-green-50 rounded-md">
                      {state.message}
                    </div>
                  )}

                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Content'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-6 min-h-[400px] bg-background">
                  <div className="text-center mb-8">
                    <div className="text-9xl mb-6">{selectedRental.emoji}</div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
                      Welcome to {selectedRental.subdomain}.{rootDomain}
                    </h1>
                  </div>
                  
                  {content ? (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-center">
                      No content yet. Switch to the Edit tab to add some content.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}