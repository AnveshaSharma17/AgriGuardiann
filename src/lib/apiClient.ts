// API Client for Node.js + MongoDB Backend
// Replaces Supabase client with direct API calls

import type { User, Session } from '@/types/models';
import { safeJsonParse } from './api-helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
    const session = localStorage.getItem('session');
    if (session) {
        try {
            const parsed = JSON.parse(session);
            return parsed.access_token;
        } catch {
            return null;
        }
    }
    return null;
};

// Helper for API requests
async function apiRequest<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

interface SignUpOptions {
    data?: {
        name?: string;
    };
}

interface AuthStateCallback {
    (event: string, session: Session | null): void;
}

// API Client object (mimics Supabase structure for easy replacement)
export const api = {
    // Auth methods
    auth: {
        async signUp({ email, password, options }: { email: string; password: string; options?: SignUpOptions }) {
            const result = await apiRequest<{ user: User; session: Session }>('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    name: options?.data?.name || email.split('@')[0],
                }),
            });

            // Store session
            if (result.session) {
                localStorage.setItem('session', JSON.stringify(result.session));
            }

            return { data: result, error: null };
        },

        async signInWithPassword({ email, password }: { email: string; password: string }) {
            try {
                const result = await apiRequest<{ user: User; session: Session }>('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });

                // Store session
                if (result.session) {
                    localStorage.setItem('session', JSON.stringify(result.session));
                }

                return { data: result, error: null };
            } catch (error) {
                return { data: null, error: error as Error };
            }
        },

        async signOut() {
            localStorage.removeItem('session');
            await apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => { });
            return { error: null };
        },

        async getSession() {
            const sessionStr = localStorage.getItem('session');
            if (!sessionStr) {
                return { data: { session: null }, error: null };
            }

            const session = safeJsonParse<Session | null>(sessionStr, null);
            return { data: { session }, error: null };
        },

        async getUser() {
            try {
                const user = await apiRequest<{ user: User }>('/api/auth/me');
                return { data: { user: user.user }, error: null };
            } catch (error) {
                return { data: { user: null }, error: error as Error };
            }
        },

        onAuthStateChange(callback: AuthStateCallback) {
            // Simulate Supabase auth state listener
            const session = localStorage.getItem('session');
            if (session) {
                const parsed = safeJsonParse<Session | null>(session, null);
                if (parsed) {
                    setTimeout(() => callback('SIGNED_IN', parsed), 0);
                }
            }

            // Return unsubscribe function
            return {
                data: {
                    subscription: {
                        unsubscribe: () => { },
                    },
                },
            };
        },
    },

    // Database query methods
    from(table: string) {
        return {
            async select(columns: string = '*') {
                const data = await apiRequest(`/api/${table}`);
                return { data, error: null };
            },

            async insert<T = unknown>(values: T) {
                const data = await apiRequest(`/api/${table}`, {
                    method: 'POST',
                    body: JSON.stringify(values),
                });
                return { data, error: null };
            },

            async update<T = unknown>(values: T) {
                return {
                    eq: async (column: string, value: string | number) => {
                        // For user profile updates
                        if (table === 'profiles') {
                            const data = await apiRequest('/api/user/profile', {
                                method: 'PUT',
                                body: JSON.stringify(values),
                            });
                            return { data, error: null };
                        }
                        throw new Error('Update not implemented for this table');
                    },
                };
            },

            async delete() {
                return {
                    eq: async (column: string, value: string | number) => {
                        const data = await apiRequest(`/api/${table}/${value}`, {
                            method: 'DELETE',
                        });
                        return { data, error: null };
                    },
                };
            },

            // Chainable query methods
            eq(column: string, value: string | number | boolean) {
                return this;
            },

            maybeSingle() {
                return this.select();
            },

            single() {
                return this.select();
            },

            limit(count: number) {
                return this;
            },

            order(column: string, options?: { ascending?: boolean }) {
                return this;
            },
        };
    },
};

// Export as default for easy replacement
export default api;
