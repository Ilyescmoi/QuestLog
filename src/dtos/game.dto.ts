export interface GameDTO {
    title: string;
    studio?: string;
    pegi?: string;
    summary?: string;
    cover_url?: string;
    release_date?: Date;
    platformIds: number[];
}

export type UpdateGameDTO = Partial<GameDTO>;
