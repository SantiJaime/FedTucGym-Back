import { env } from "../config/env";
import { tournamentService } from './index.service';

export default class GoogleSheetsService {
  public async exportTournamentToSheet(tournamentId: number): Promise<string> {
    try {
      const { membersTournaments, tournamentName } =
        await tournamentService.getAllPaidMembersByTournament(tournamentId);

      const scriptUrl = env.SHEETS_SCRIPT_URL;

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membersTournaments, tournamentName }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al enviar datos a Sheets: ${text}`);
      }

      const data = await response.json();

      return data.url;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
