import { z } from 'zod';

export const CreateTournamentDTO = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
    startDate: z.date(),
    endDate: z.date(),
});

export type CreateTournament = z.infer<typeof CreateTournamentDTO>;