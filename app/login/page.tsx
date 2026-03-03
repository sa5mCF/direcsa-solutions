'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/src/modules/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50/50">
            <Suspense fallback={<div className="max-w-md w-full h-[500px] bg-white rounded-2xl animate-pulse shadow-xl"></div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
