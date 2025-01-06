export interface ICoreAppService {
  createUser(user: any): Promise<any>;
  getUser(id: string): Promise<any>;
  // ... other methods
}
