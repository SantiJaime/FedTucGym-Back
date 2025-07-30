import MembersService from "./members.service";
import GoogleSheetsService from "./sheets.service";
import TournamentService from "./tournaments.service";
import UserService from "./users.service";

const userService = new UserService();
const membersService = new MembersService();
const tournamentService = new TournamentService();
const sheetsService = new GoogleSheetsService();

export { userService, membersService, tournamentService, sheetsService };
