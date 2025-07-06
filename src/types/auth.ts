// Type User
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    sexe: string;
    email: string;
    numero: number;
    numero_identifiant: string;
    email_verified_at: string;
    two_factor_confirmed_at: string | null;
    current_team_id: number | null;
    profile_photo_path: string | null;
    role: string;
    statut: string;
    created_at: string;
    updated_at: string;
    compagnie_id: number;
    profile_photo_url: string;
}
  
// Type AuthResponse
export interface AuthResponse {
    user: User;
    token: string;
}
  