export interface Platform {
    id: number;
    name: string;
    slug: string;
}

export interface Game {
    id: number;
    title: string;
    studio?: string;
    pegi?: string;
    summary?: string;
    cover_url?: string;
    release_date?: Date;
    created_at?: Date;
    platforms?: Platform[];
}
