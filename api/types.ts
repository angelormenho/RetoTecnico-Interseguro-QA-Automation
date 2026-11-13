export interface UserPayload {
  nome: string;
  email: string;
  password: string;
  /** ServeRest lo recibe como texto: "true" | "false". */
  administrador: 'true' | 'false';
}

export interface User extends UserPayload {
  _id: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ProductPayload {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

export interface Product extends ProductPayload {
  _id: string;
}

export interface MessageResponse {
  message: string;
}

export interface CreatedResponse extends MessageResponse {
  _id: string;
}

export interface LoginResponse extends MessageResponse {
  authorization: string;
}

export interface ProductListResponse {
  quantidade: number;
  produtos: Product[];
}