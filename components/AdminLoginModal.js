'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginModal({ open, onSuccess, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }
      onSuccess();
    } catch {
      setError('Network error — please check connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#FFCB74] flex items-center justify-center mx-auto sm:mx-0 shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-heading font-bold text-[#111111]">
              Atelier Management
            </DialogTitle>
            <DialogDescription className="text-[#6F6F6F] text-xs mt-1 font-body">
              Sign in with your admin credentials to manage inventory and products.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] flex items-center gap-1.5 font-semibold">
              <User className="w-3.5 h-3.5 text-[#111111]" /> Username
            </label>
            <Input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
              className="bg-[#F6F6F6] border-[#E5E5E5] focus:border-[#111111] text-[#111111] placeholder:text-[#A0A0A0] rounded-xl h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#2F2F2F] flex items-center gap-1.5 font-semibold">
              <Lock className="w-3.5 h-3.5 text-[#111111]" /> Password
            </label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-[#F6F6F6] border-[#E5E5E5] focus:border-[#111111] text-[#111111] placeholder:text-[#A0A0A0] rounded-xl h-11"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="default"
              className="w-full font-heading text-xs tracking-widest uppercase h-11 bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] shadow-md font-bold rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Access Atelier Dashboard'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
