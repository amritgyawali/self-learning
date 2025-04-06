'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function GuestPhotoUpload() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Photo filters state
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });

  // Share options state
  const [shareOptions, setShareOptions] = useState({
    whatsapp: true,
    email: false,
    download: true
  });

  // Use useCallback for event handlers to improve performance
  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [previewUrl]);

  // Validate phone number format
  const isValidPhone = (phone: string): boolean => {
    // Basic phone validation - can be enhanced based on requirements
    return /^\+?[0-9\s-()]{8,}$/.test(phone);
  };

  // Validate email format if provided
  const isValidEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleUpload = useCallback(async () => {
    // Form validation
    if (!photo || !name || !phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (!isValidPhone(phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number',
        variant: 'destructive'
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address or leave it empty',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('eventId', new URLSearchParams(window.location.search).get('eventId') || '');
      formData.append('filters', JSON.stringify(filters));
      formData.append('shareOptions', JSON.stringify(shareOptions));

      const response = await fetch('/api/guest-photos', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      toast({
        title: 'Success',
        description: 'Photo uploaded successfully! You will receive your photos shortly.',
      });

      // Reset form
      setPhoto(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      setName('');
      setPhone('');
      setEmail('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload photo',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  }, [photo, name, phone, email, filters, shareOptions, previewUrl, toast]);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <LoadingOverlay isLoading={isUploading} loadingText="Uploading your photo..." spinnerSize="large">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8">Upload Your Photos</h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="cursor-pointer"
              />
            </div>

            {previewUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  style={{
                    filter: `
                      brightness(${filters.brightness}%) 
                      contrast(${filters.contrast}%) 
                      saturate(${filters.saturation}%) 
                      blur(${filters.blur}px)
                    `
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (WhatsApp) *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your WhatsApp number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {photo && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Photo Filters</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Brightness</Label>
                      <Slider
                        value={[filters.brightness]}
                        onValueChange={([value]) => setFilters(f => ({ ...f, brightness: value }))}
                        min={0}
                        max={200}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contrast</Label>
                      <Slider
                        value={[filters.contrast]}
                        onValueChange={([value]) => setFilters(f => ({ ...f, contrast: value }))}
                        min={0}
                        max={200}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Saturation</Label>
                      <Slider
                        value={[filters.saturation]}
                        onValueChange={([value]) => setFilters(f => ({ ...f, saturation: value }))}
                        min={0}
                        max={200}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Blur</Label>
                      <Slider
                        value={[filters.blur]}
                        onValueChange={([value]) => setFilters(f => ({ ...f, blur: value }))}
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Share Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp">Share via WhatsApp</Label>
                      <Switch
                        id="whatsapp"
                        checked={shareOptions.whatsapp}
                        onCheckedChange={(checked) => setShareOptions(s => ({ ...s, whatsapp: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-share">Share via Email</Label>
                      <Switch
                        id="email-share"
                        checked={shareOptions.email}
                        onCheckedChange={(checked) => setShareOptions(s => ({ ...s, email: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="download">Enable Download</Label>
                      <Switch
                        id="download"
                        checked={shareOptions.download}
                        onCheckedChange={(checked) => setShareOptions(s => ({ ...s, download: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              onClick={handleUpload}
              disabled={isUploading || !photo || !name || !phone}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </div>
        </Card>
      </div>
    </LoadingOverlay>
  );
}