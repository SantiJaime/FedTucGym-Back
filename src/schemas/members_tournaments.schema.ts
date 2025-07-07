import { z } from "zod";
import { IdDTO } from "./id.schema";

export const RegisterMembersTournamentsDTO = z.object({
  id_member: IdDTO,
  id_tournament: IdDTO,
});

export const GetMembersTournamentsDTO = z.object({
  id_tournament: IdDTO,
  id_category: IdDTO,
  id_level: IdDTO,
});

export const GetMembersTournamentsByGymDTO = GetMembersTournamentsDTO.extend({
  id_gym: IdDTO,
});

export const MembersTournamentsDTO = RegisterMembersTournamentsDTO.extend({
  paid: z.boolean(),
});

export const UpdatePaidMembersTournamentsDTO = z.object({
  id_member: IdDTO,
  id_tournament: IdDTO,
  paid: z.boolean(),
});

export type CreateMembersTournaments = z.infer<
  typeof RegisterMembersTournamentsDTO
>;

const MembersTournaments = z.object({
  member: z.string(),
  dni: z.number(),
  id_member: IdDTO,
  id_tournament: IdDTO,
  id_gym: IdDTO,
  gym: z.string(),
  paid: z.boolean(),
});

export type MembersTournaments = z.infer<typeof MembersTournamentsDTO>;

export type MembersTournamentsView = z.infer<typeof MembersTournaments>;

export type UpdatePaidMembersTournaments = z.infer<
  typeof UpdatePaidMembersTournamentsDTO
>;

export type GetMembersTournaments = z.infer<typeof GetMembersTournamentsDTO>;

export type GetMembersTournamentByGym = z.infer<
  typeof GetMembersTournamentsByGymDTO
>;
