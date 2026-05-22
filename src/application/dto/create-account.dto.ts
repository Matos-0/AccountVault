export interface CreateAccountDTO {
  id: number;
  dominio: string
  email?: string
  user?: string
  password: string
  additional_info?: string

}